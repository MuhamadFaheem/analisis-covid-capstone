var con = require('../connection')
var mysql = require('mysql')
var md5 = require('md5')
const { nanoid } = require('nanoid')

exports.regist = function (req, res) {
    var id = nanoid(16)
    var post = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password)
    }

    var query = 'select email from ?? where ?? = ?'
    var table = ['user', 'email', post.email]

    query = mysql.format(query, table)

    con.query(query, function (error, rows) {
        if (error) {
            res.status(500).json({
                success: false,
                error: error
            })
        } else {
            if (rows.length == 0) {
                var data = {
                    id_user: 'user-'+id,
                    username: post.username,
                    email: post.email,
                    password: post.password
                }
                var query = 'insert into ?? set ?'
                var table = ['user']
                query = mysql.format(query, table)
                con.query(query, data, function (error, rows) {
                    if (error) {
                        res.status(500).json({
                            success: false,
                            error: error
                        })
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Registration succeed',
                            data:({
                                id_user: 'user-'+id,
                                username: post.username,
                                email: post.email,
                                password: post.password,
                            })
                        });
                    }
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Email has been registered. Registration failed'
                });
            }
        }
    })
}

exports.login = function (req, res){
    var post = {
        email: req.body.email,
        password: req.body.password
    } 
    
    var query = "select * from ?? where ?? = ? and ?? = ?"
    var table = ['user', 'email', post.email, 'password', md5(post.password)]

    query = mysql.format(query, table)
    con.query(query, function(error, rows){
        if(error){
            console.log(error)
        }else{
            if(rows.length == 1){
                id_user = rows[0].id_user
                username= rows[0].username

                var data = {
                    id_user: id_user,
                    username: username, 
                }
                res.status(200).json({
                    error: false,
                    userId: data.id_user,
                    userName: data.username,
                    message: 'Login success',
                })
            }else{
                res.status(404).json({
                error: true,
                message: 'Wrong e-mail or password!'
                })   
            } 
        }
    }) 
}  

exports.postTest = function (req, res){
    var post = {
        id_user: req.body.id_user,
        nama_diagnosis: req.body.nama_diagnosis,
        nama_obat: req.body.nama_obat,
        keterangan:req.body.keterangan,
        date: new Date()
    }

    con.query('INSERT INTO riwayat set ?', post, function(error, rows, fields){
        //For checking overall fields if there any blank field when input data
        /*if(params.id_user === '' ||params.keterangan === '' || params.nama_obat === '' ||params.nama_diagnosis === '' ||params.date === ''){
            res.status(400).json({
                success: false,
                message: "There is a blank field. Please re-check your data before submit"
            }) */
        if(post.id_user === ''){ 
            res.status(500).json({
                success: false,
                message: "please define id of user"
            })
        } else if(post.keterangan === ''){
            res.status(500).json({
                success: false,
                message: "please define keterangan"
            })
        }else if(post.nama_obat === ''){
            res.status(500).json({
                success: false,
                message: "please define nama obat"
            })
        }else if(post.nama_diagnosis === ''){
            res.status(500).json({
                success: false,
                message: "please define nama diagnosis"
            })
        }else if (error){
            console.log(error)
        }else{
            res.status(200).json({
            success: true,
            message: 'Data succesfully send',
            history:({
                data:({
                    id_user: post.id_user,
                    nama_diagnosis: post.nama_diagnosis,
                    nama_obat: post.nama_obat,
                    keterangan: post.keterangan,
                    date: Date()
                    })
                })
            })
        } 
    })
}

exports.editProfileName = function (req, res){
    var query = 'select * from ?? where ?? = ?'
    var table = ['user', 'id_user', req.body.id_user]

    query = mysql.format(query, table)
    con.query(query, function(error, rows){
        if(error){
            res.status(500).json({
                success: false,
                error: error
            })
        }
        if(rows.length == 1){
            id_user = rows[0].id_user,
            username= rows[0].username
            var data = {
                username: username,
                id_user: id_user
            }
            var post = {
                username: req.body.username,
            }
            query = "update ?? set ?? = ? where ?? = ?"
            table = ['user', 'username', post.username, 'id_user', req.body.id_user]
            
            query=mysql.format(query, table)
            con.query(query, post, function(error, rows){
                if(error){
                    res.status(500).json({
                        success: false,
                        error: error
                    })
                } else {
                    res.status(200).json({
                        error: false,
                        message: 'Data has changed',
                        id_user: data.id_user,
                        userName: post.username
                    })
                }
            })
        } else {
            res.status(404).json({
                error: true,
                message: 'Data not found'
            })
        }
    })
}