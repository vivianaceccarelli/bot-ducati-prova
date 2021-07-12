from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os
import requests
import urlpath
from urllib.parse import urlparse
import PIL
from PIL import Image
import urllib.request
import os
from flask import Flask, request, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
from ibm_watson import AssistantV2
#from upload.py import function
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
try:
    import ibm_db
except:
    pass
from geopy.geocoders import Nominatim
from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os
import requests
import os
import uuid
import ibm_boto3
from ibm_botocore.client import Config
from ibm_botocore.exceptions import ClientError
import ibm_s3transfer.manager
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
try:
    import ibm_db
except:
    pass
from geopy.geocoders import Nominatim


from flask import Flask, render_template, request, redirect, url_for, jsonify
import json
import os
#from pylib import *
#from pylib import get_buckets
import requests
import os
import uuid
import ibm_boto3
from ibm_botocore.client import Config
from ibm_botocore.exceptions import ClientError
import ibm_s3transfer.manager
from ibm_watson import AssistantV2
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
try:
    import ibm_db
except:
    pass
from geopy.geocoders import Nominatim
app = Flask(__name__)

#UPLOAD_FOLDER = 'D:/uploads'
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','mp4'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):  
    return filename[-3:].lower() in ALLOWED_EXTENSIONS
COS_ENDPOINT = " " 
COS_API_KEY_ID = ""
COS_AUTH_ENDPOINT = "https://iam.cloud.ibm.com/identity/token"
COS_SERVICE_CRN = ""
COS_STORAGE_CLASS = "us-south" # example: us-south-standard

# Create client connection
cos_cli = ibm_boto3.client("s3",
    ibm_api_key_id=COS_API_KEY_ID,
    ibm_service_instance_id=COS_SERVICE_CRN,
    ibm_auth_endpoint=COS_AUTH_ENDPOINT,
    config=Config(signature_version="oauth"),
    endpoint_url=COS_ENDPOINT
)


app.config["UPLOAD_DIR"] = 'static/raw/'
apikey = ''
url = ''
assistantid = ''
sessionid = ''


with open('ibm-db2-credentials.json', 'r') as credentialsFile:
    credentials1 = json.loads(credentialsFile.read())

dsn_driver = "IBM DB2 ODBC DRIVER"
dsn_database = credentials1['db']
dsn_hostname = credentials1['host']
dsn_port = "50000"
dsn_uid = credentials1['username']
dsn_pwd = credentials1['password']

dsn = (
    "DRIVER={{IBM DB2 ODBC DRIVER}};"
    "DATABASE={0};"
    "HOSTNAME={1};"
    "PORT={2};"
    "PROTOCOL=TCPIP;"
    "UID={3};"
    "PWD={4};").format(dsn_database, dsn_hostname, dsn_port, dsn_uid, dsn_pwd)
try:
    conn = ibm_db.connect(dsn, "", "")
except:
    pass

#########################
# Create Orders Table
#########################

table = ' CREATE TABLE ORDERS( \
    ID int,DATA date, \
    COGNOME varchar(255), \
    PROGETTO varchar(255), \
    MODELLO varchar(255), \
    VIN varchar(255), \
    MATRICOLAMOTORE varchar(255), \
    COPOFLOTTE varchar(255), \
    KMTOTALI varchar(255), \
    TIPODISTRADA varchar(255), \
    LUOGO varchar(255), \
    LITRI varchar(255), \
    SEGNALAZIONE varchar(2000), \
    DESCRIZIONE1 varchar(255), \
    DESCRIZIONE2 varchar(255), \
    DESCRIZIONE3 varchar(255), \
    CAMPOLIBERO varchar(255), \
    STATO varchar(255), \
    NOTE varchar(255), \
    FOTO varchar(255)	); ' 

try:
    ibm_db.exec_immediate(conn, table)
except:
    pass


with open('watson-assistant-credentials.json', 'r') as credentialsFile:
    credentials = json.loads(credentialsFile.read())

apikey = credentials.get('apikey')
url = credentials.get('url')
assistantid = credentials.get('assistant-id')

#########################
# Watson Assistant Authentication
#########################

authenticator = IAMAuthenticator(apikey)
assistant = AssistantV2(
    version='2020-04-01',
    authenticator=authenticator
)

assistant.set_service_url(url)

#########################
# Watson Assistant Sessions
#########################


def createSession():
    global sessionid
    session = assistant.create_session(assistantid).get_result()
    sessionid = session.get('session_id')
    print('New Session created ID: ', sessionid)


def destroySession():
    try:
        response = assistant.delete_session(
        assistant_id=assistantid, session_id=sessionid).get_result()
        print(response)
    except Exception as e:
        pass

def log_done():
    print("DONE!\n")

def log_client_error(e):
    print("CLIENT ERROR: {0}\n".format(e))

def log_error(msg):
    print("UNKNOWN ERROR: {0}\n".format(msg))

def create_bucket(bucket_name):
    print("Creating new bucket: {0}".format(bucket_name))
    try:
        cos_cli.create_bucket(
            Bucket=bucket_name, 
            CreateBucketConfiguration={
                "LocationConstraint":COS_STORAGE_CLASS
            }
        )
        print("Bucket: {0} created!".format(bucket_name))
        log_done()
    except ClientError as be:
        log_client_error(be)
    except Exception as e:
        log_error("Unable to create bucket: {0}".format(e))


def get_buckets():
    print("Retrieving list of buckets")
    try:
        bucket_list = cos_cli.list_buckets()
        for bucket in bucket_list["Buckets"]:
            print("Bucket  Name: {0}".format(bucket["Name"]))
        
        log_done()
    except ClientError as be:
        log_client_error(be)
    except Exception as e:
        log_error("Unable to retrieve list buckets: {0}".format(e))


def upload_large_file(buck, filename, link):

    print("Starting large file upload for {0} to bucket: {1}".format(filename, buck))

    # set the chunk size to 5 MB
    part_size = 1024 * 1024 * 5

    # set threadhold to 5 MB
    file_threshold = 1024 * 1024 * 5

    # set the transfer threshold and chunk size in config settings
    transfer_config = ibm_boto3.s3.transfer.TransferConfig(
        multipart_threshold=file_threshold,
        multipart_chunksize=part_size
    )

    # create transfer manager
    transfer_mgr = ibm_boto3.s3.transfer.TransferManager(cos_cli, config=transfer_config)

    try:
        # initiate file upload
        future = transfer_mgr.upload(link, buck, filename)

        # wait for upload to complete
        future.result()

        return ("Large file upload complete!")
    except Exception as e:
        return("Unable to complete large file upload: {0}".format(e))
    finally:
        transfer_mgr.shutdown()


# assistant.delete_session(skillid, "<YOUR SESSION ID>").get_result()

@app.route('/getWatsonAssistantResponse', methods=['GET', 'POST'])
def test():
    msg = request.args['msg']

    message = assistant.message(
        assistantid,
        sessionid,
        input={'text': msg}
    ).get_result()
    print('tasto cliccato: ' + msg)
    print(json.dumps(message, indent=2))
    try:
        payload = {
            "message": message['output']['generic'][0]['text'],
            "options": message['output']['generic'][1]['options'],
            "response_type": message['output']['generic'][1]['response_type']
        }
    except:
        payload = {
            "message": message['output']['generic'][0]['text'],
            "options": "",
            "response_type": ""
        }

    # print(msg)
    # print(json.dumps(message, indent=2))
    return jsonify(payload)


@app.route("/getlocation", methods=["GET"])
def getlocation():
    lat = request.args['lat']
    lon = request.args['lon']
    location = str(lat)+","+str(lon)
    geolocator = Nominatim(user_agent="smart_avatar_application")
    location = geolocator.reverse(location)
    place = location.address
    outputjson = {"place": place}

    return jsonify(outputjson)


@app.route('/dashboard')
def chatbot():
    return render_template('dashboard.html')




@app.route('/uploaddemo', methods=['GET', 'POST'])
#def upload_large_file(bucket_name, item_name, file_path):
def upload():
    
    if request.method == 'POST':
        file = request.files['file']
        #print("Starting large file upload for {0} to bucket: {1}".format(item_name, bucket_name))
       # print(f"UPLOAD_FOLDER is {UPLOAD_FOLDER!r}", flush=True)    
        
        if file and allowed_file(file.filename):
   # return upload_large_file("buck-prova", "mic.PNG", "/content/mic.PNG")
            #print (file.filename)
            filename = secure_filename(file.filename)
            #prova = open(filename, "r")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))            
            #path = (os.path.realpath(prova.name))            
            #bucket_name="buck-prova"
            buck="my-buck-duc"
            part1 = "https://bot-duc-prova.eu-gb.mybluemix.net"
            part2= url_for('uploaded_file', filename=filename)
            URL=part1+part2

            import urllib.request
            
            cwd = os.getcwd()
            slash = "/"
            path = cwd+slash+filename

            
            urllib.request.urlretrieve(URL, path)
            
            output = upload_large_file(buck, filename, path)
            cloudurl="https://my-buck-duc.s3.us-south.cloud-object-storage.appdomain.cloud/"
            linkdb=cloudurl+filename

            return linkdb

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)



@app.route('/addDatabaseContents', methods=['GET', 'POST'])
def addDatabaseContentsJson():
    if request.method == 'POST':
        try:
            conn = ibm_db.connect(dsn, "", "")
        except:
            pass
        
        opt = request.form
        data = json.loads(opt['orderDetails'])
        try:
            ids = getIDs(conn) + 1
        except:
            ids = 1
        
        a = "\'"
        b = a+data.get('data')+a
        c = a+data.get('cognome')+a
        d = a+data.get('progetto')+a
        e = a+data.get('modello')+a
        f = a+data.get('vin')+a
        g = a+data.get('matricolamotore')+a
        h = a+data.get('copoflotte')+a
        i = a+data.get('kmtotali')+a
        l = a+data.get('tipodistrada')+a
        n = a+data.get('luogo')+a
        o = a+data.get('litri')+a
        p = a+data.get('segnalazione')+a
        q = a+data.get('descrizione1')+a
        r = a+data.get('descrizione2')+a
        s = a+data.get('descrizione3')+a
        t = a+data.get('campolibero')+a
        v = a+data.get('stato')+a
        u = a+data.get('note')+a
        z = a+data.get('foto')+a
        
        insert = 'INSERT INTO {0}.ORDERS VALUES(%d, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'.format(dsn_uid) % (
            ids, b, c, d, e, f, g, h, i, l, n, o, p, q, r, s, t, v, u,z)

    
        try:
            ibm_db.exec_immediate(conn, insert)
            return {'flag': 'success'}
        except:
            return {'flag': 'failed'}
        

@app.route('/getDatabaseContents')
def getDatabaseContentsJson():
    try:
        conn = ibm_db.connect(dsn, "", "")
    except:
        pass
    
    select_statement = 'SELECT * FROM {0}.ORDERS ORDER BY ID desc;'.format(
        dsn_uid)
    res = ibm_db.exec_immediate(conn, select_statement)

    result = ibm_db.fetch_both(res)
    resultDict = []
    while(result):
        returnDictBuffer = {'ID': result['ID'],
                            'DATA': result['DATA'],
                            'COGNOME': result['COGNOME'],
                          'PROGETTO': result['PROGETTO'],
                          'MODELLO': result['MODELLO'],
                           'VIN': result['VIN'],
                           'MATRICOLAMOTORE': result['MATRICOLAMOTORE'],
                           'COPOFLOTTE': result['COPOFLOTTE'],
                          'KMTOTALI': result['KMTOTALI'],
                          'TIPODISTRADA': result['TIPODISTRADA'],
                          'LUOGO': result['LUOGO'],
                          'LITRI': result['LITRI'],
                          'SEGNALAZIONE': result['SEGNALAZIONE'],
                          'DESCRIZIONE1': result['DESCRIZIONE1'],
                          'DESCRIZIONE2': result['DESCRIZIONE2'],
                          'DESCRIZIONE3': result['DESCRIZIONE3'],
                          'CAMPOLIBERO': result['CAMPOLIBERO'], 
                          'STATO': result['STATO'],  
                          'NOTE': result['NOTE'],                         
                          'FOTO': result['FOTO']}

        resultDict.append(returnDictBuffer)
        result = ibm_db.fetch_both(res)
        
    return jsonify(resultDict)

    
def getIDs(conn):
    select_statement = 'SELECT ID FROM {0}.ORDERS ORDER BY ID desc;'.format(
        dsn_uid)
    stmt = ibm_db.exec_immediate(conn, select_statement)
    finalID = 0
    result = ibm_db.fetch_both(stmt)
    finalID = int(result['ID'])
    return finalID

@app.route('/restartSession', methods=['GET', 'POST'])
def restartSession():
    global sessionid
    if sessionid == '':
        createSession()
    else:
        destroySession()
        createSession()


@app.route('/', methods=['GET', 'POST'])
def index():
    global sessionid
    if sessionid == '':
        createSession()
    else:
        destroySession()
        createSession()
    return render_template('index.html')


port = os.getenv('VCAP_APP_PORT', '8080')
if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    app.run(debug=True, host='0.0.0.0', port=port)










#@app.route('/static/javascript/upload.py', methods=['GET', 'POST'])
