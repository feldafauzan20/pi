import os
from os.path import join, dirname
from dotenv import load_dotenv
from pymongo import MongoClient
import jwt
from datetime import datetime, timedelta
import hashlib
from flask import Flask, render_template, jsonify, request, redirect, url_for, make_response, current_app, send_from_directory, session
from urllib.parse import quote
from flask_socketio import SocketIO, emit
from bson import ObjectId
from bson.json_util import dumps

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

MONGODB_URI = os.environ.get("MONGODB_URI")
DB_NAME =  os.environ.get("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
SECRET_KEY = os.environ.get("SECRET_KEY")

app = Flask(__name__)
socketio = SocketIO(app)

TOKEN_KEY = 'my_token'


# USER AREA
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sign_in', methods=['POST'])
def sign_in():
    id_receive = request.form.get("id_give")
    password_receive = request.form.get("password_give")
    pw_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    result = db.users.find_one(
        {
            "id_user": id_receive,
            "password_user": pw_hash,
        }
    )
    if result:
        payload = {
            "id": id_receive,
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        response = jsonify(
            {
                "result": "success",
                "token": token,
            }
        )
        response.set_cookie(f"my_token_{id_receive}", token, max_age=60 * 60 * 24, httponly=True, samesite='Lax')
        return response
    else:
        return jsonify(
            {
                "result": "fail",
                "msg": "Kami tidak dapat menemukan pengguna dengan kombinasi id/password tersebut",
            }
        )


@app.route('/home_user/<id_receive>')
def home_user(id_receive):
    token_receive = request.cookies.get(f"my_token_{id_receive}")
    print(f'token receive: {token_receive}' )
    if token_receive:
        try:
            payload = jwt.decode(
                token_receive,
                SECRET_KEY,
                algorithms=['HS256']
            )
            user_info = db.users.find_one({'id_user': payload.get('id')})
            if user_info:
                return render_template('homeUser.html', user_info=user_info, id_receive=id_receive)
            else:
                return redirect(url_for('home', msg='User not found'))
        except jwt.ExpiredSignatureError:
            return redirect(url_for('home', msg='Token has expired'))
        except jwt.exceptions.DecodeError:
            return redirect(url_for('home', msg='Invalid token'))
    else:
        return redirect(url_for('home', msg='Token not found'))


@app.route('/order_user/<id_receive>')
def order_user(id_receive):
    token_receive = request.cookies.get(f"my_token_{id_receive}")
    if token_receive:
        try:
            payload = jwt.decode(
                token_receive,
                SECRET_KEY,
                algorithms=['HS256']
            )
            user_info = db.users.find_one({'id_user': payload.get('id')})
            if user_info:
                return render_template('orderUser.html', user_info=user_info, id_receive=id_receive)
            else:
                return redirect(url_for('home', msg='User not found'))
        except jwt.ExpiredSignatureError:
            return redirect(url_for('home', msg='Token has expired'))
        except jwt.exceptions.DecodeError:
            return redirect(url_for('home', msg='Invalid token'))
    else:
        return redirect(url_for('home', msg='Token not found'))

@app.route('/login')
def login():
    msg = request.args.get('msg')
    return render_template('login-signup.html', msg=msg)

@app.route('/sign_up/save', methods=['POST'])
def signup_save():
    id_receive = request.form['id_give']
    password_receive = request.form['password_give']

    exists = bool(db.users.find_one({'id_user': id_receive}))

    if exists:
        return jsonify({'result': 'fail', 'exist': exists})
    
    password_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    doc = {
        "id_user": id_receive,
        "password_user": password_hash,
    }

    db.users.insert_one(doc)
    return jsonify({'result': 'success', 'exist': exists})

@app.route('/check_id', methods=['POST'])
def check_id():
    id_receive = request.form['id_give']
    exists = bool(db.users.find_one({'id_user': id_receive}))
    return jsonify({'exists': exists})
  
@app.route('/submitdatabase', methods=['POST'])
def submitdatabase():
    try:
        id_receive = request.form['input_id']
        name_receive = request.form['input_nama']
        notelp_receive = request.form['input_notelp']
        droppoint_receive = request.form['input_droppoint']
        ambilantar_receive = request.form['input_ambilantar']
        layanan_receive = request.form['input_layanan']
        jumlah_dp_receive = request.form['input_jumlah_dp']
        dp_receive = request.form['input_dp']
        file_dp_receive = request.files.get('input_bukti_dp')
        jenis_sepatu_receive = request.form['input_jenis_sepatu']
        kondisi_sepatu_receive = request.form['input_kondisi']

        today = datetime.now()
        tanggal = today.strftime('%Y-%m-%d')
        estimasi_tanggal = today + timedelta(days=3)
        estimasi_tanggal_str = estimasi_tanggal.strftime('%Y-%m-%d')

        count = db.userInputs.count_documents({})
        num = count + 1

        if file_dp_receive:
            filename = f"{id_receive}_{file_dp_receive.filename}"
            file_path = os.path.join(current_app.root_path, 'static/img/uploads/user', filename)
            file_dp_receive.save(file_path)
            print(f"File disimpan di: {file_path}")
        else:
            filename = None

        doc = { 
            'num': num,
            'id_user': id_receive,
            'nama_user': name_receive,  
            'notelp_user': notelp_receive,
            'droppoint_user': droppoint_receive,
            'ambilantar_user': ambilantar_receive,
            'layanan_user': layanan_receive,
            'jumlah_yang_harus_dibayar': jumlah_dp_receive,
            'bank_user': dp_receive,
            'file_dp_user': filename,
            'jenis_sepatu_user': jenis_sepatu_receive,
            'kondisi_sepatu_user': kondisi_sepatu_receive,
            'status': 'pending',
            'tanggal_order_masuk': tanggal,
            'pesanan_selesai': estimasi_tanggal_str,
            'note_decline': 'None'
        }

        result = db.userInputs.insert_one(doc)
        doc['_id'] = str(result.inserted_id)

        socketio.emit('new_order', doc)
        return redirect(url_for('riwayat_pesan_user', id_receive=id_receive))
    except Exception as e:
        print(f"Error dalam rute submitdatabase: {e}")
        return jsonify({'result': 'error', 'message': str(e)}), 500

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    directory = os.path.join(current_app.root_path, 'static/img/uploads/user')
    return send_from_directory(directory, filename)

@app.route('/riwayatPesan_user/<id_receive>')
def riwayat_pesan_user(id_receive):
    token_receive = request.cookies.get(f"my_token_{id_receive}")
    print(f'token receive: {token_receive}' )
    if token_receive:
        try:
            payload = jwt.decode(
                token_receive,
                SECRET_KEY,
                algorithms=['HS256']
            )
            user_info = db.users.find_one({'id_user': payload.get('id')})
            if user_info:
                return render_template('riwayatPesanUser.html', user_info=user_info, id_receive=id_receive)
            else:
                return redirect(url_for('home', msg='User not found'))
        except jwt.ExpiredSignatureError:
            return redirect(url_for('home', msg='Token has expired'))
        except jwt.exceptions.DecodeError:
            return redirect(url_for('home', msg='Invalid token'))
    else:
        return redirect(url_for('home', msg='Token not found'))

@app.route('/data_user', methods=['GET'])
def data_user():
    id_receive = request.args.get('id_receive')
    if not id_receive:
        return jsonify({'message': 'ID user tidak diberikan'}), 400

    user_cursor = db.userInputs.find({'id_user': id_receive}, {'_id': False})
    user_list = list(user_cursor)
    if user_list:
        return dumps({'user': user_list})
    else:
        return jsonify({'message': 'User not found'}), 404

@app.route('/send', methods = ['POST'])
def send():
    
    subject = 'Reservasi Masuk'
    body = f""" Halo, Ada Pesanan Masuk, Tolong diperiksa!"""
    
    subject_encoded = quote(subject)
    body_encoded = quote(body)
    recipient_email = "randomrayhansmd@gmail.com"
    gmail_link = f"https://mail.google.com/mail/?view=cm&fs=1&to={recipient_email}&su={subject_encoded}&body={body_encoded}"
    return redirect(gmail_link)

# ADMIN AREA
@app.route('/sign_in_admin', methods=['POST'])
def sign_in_admin():
    id_receive = request.form["id_give"]
    password_receive = request.form["password_give"]
    pw_hash = hashlib.sha256(password_receive.encode("utf-8")).hexdigest()
    result = db.admin.find_one(
        {
            "id_admin": id_receive,
            "password_admin": pw_hash,
        }
    )
    if result:
        payload = {
            "id": id_receive,
            "exp": datetime.utcnow() + timedelta(seconds=60 * 60 * 24),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        response = make_response(jsonify(
            {
                "result": "success",
                "token": token,
            }
        ))
        response.set_cookie(TOKEN_KEY, token, max_age=60 * 60 * 24, httponly=True)
        return response
    else:
        return jsonify(
            {
                "result": "fail",
                "msg": "We could not find a user with that id/password combination",
            }
        )

@app.route('/login/admin')
def login_admin():
    msg = request.args.get('msg')
    return render_template('loginAdmin.html', msg=msg)

@app.route('/dashboardAdmin')
def dashboardAdmin():
    token_receive = request.cookies.get(TOKEN_KEY)
    if token_receive:
        try:
            payload = jwt.decode(
                token_receive,
                SECRET_KEY,
                algorithms=['HS256']
            )
            admin_info = db.admin.find_one({'id_admin': payload.get('id')})
            if admin_info:
                total_data = db.userInputs.count_documents({}) 
                total_approve = db.userInputs.count_documents({'status':'completed'}) 
                total_decline = db.userInputs.count_documents({'status':'decline'}) 
                return render_template('dashboardAdmin.html', admin_info=admin_info, total_data=total_data, total_approve=total_approve, total_decline=total_decline)
            else:
                return redirect(url_for('home', msg='User not found'))
        except jwt.ExpiredSignatureError:
            return redirect(url_for('home', msg='Token has expired'))
        except jwt.exceptions.DecodeError:
            return redirect(url_for('home', msg='Invalid token'))
    else:
        return redirect(url_for('home', msg='Token not found'))

@app.route('/orderAdmin')
def orderAdmin():
    token_receive = request.cookies.get(TOKEN_KEY)
    if token_receive:
        try:
            payload = jwt.decode(
                token_receive,
                SECRET_KEY,
                algorithms=['HS256']
            )
            admin_info = db.admin.find_one({'id_admin': payload.get('id')})
            if admin_info:
                return render_template('orderAdmin.html', admin_info=admin_info)
            else:
                return redirect(url_for('home', msg='User not found'))
        except jwt.ExpiredSignatureError:
            return redirect(url_for('home', msg='Token has expired'))
        except jwt.exceptions.DecodeError:
            return redirect(url_for('home', msg='Invalid token'))
    else:
        return redirect(url_for('home', msg='Token not found'))
    

@app.route('/fetch_inputs', methods=['GET'])
def fetch_inputs():
    status_filter = request.args.get('status', 'all')
    query = {} if status_filter == 'all' else {'status': status_filter}
    inputs = list(db.userInputs.find(query, {'_id': False}))
    return jsonify({'inputs': inputs})

@app.route('/fetch_user_history', methods=['GET'])
def fetch_user_history():
    status_filter = request.args.get('status', 'all')
    query = {} if status_filter == 'all' else {'status': status_filter}
    inputs = list(db.userInputs.find(query, {'_id': False}))
    return jsonify({'inputs': inputs})

@app.route('/update_status', methods=['POST'])
def update_status():
    try:
        num = request.json['num']
        decline_reason = request.json['note_decline']
        db.userInputs.update_one({'num': int(num)}, {'$set': {'status': 'completed', 'note_decline': decline_reason}})
        return jsonify({'result': 'success'})
    except Exception as e:
        print(f"Error in /update_status: {e}")
        return jsonify({'result': 'error', 'message': str(e)}), 500

@app.route('/decline_status', methods=['POST'])
def decline_status():
    try:
        data = request.json
        decline_reason = data['note_decline']
        num = data['num']
        db.userInputs.update_one(
            {'num': int(num)},
            {'$set': {'status': 'decline', 'note_decline': decline_reason}}
        )
        return jsonify({'result': 'success'})
    except Exception as e:
        print(f"Error in /decline_status: {e}")
        return jsonify({'result': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
