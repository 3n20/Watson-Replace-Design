'use strict';
require('dotenv').config({silent: true});
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var watson = require("watson-developer-cloud");
var request = require('request');
app.use(bodyParser.json())
app.use(express.static(__dirname + '/views'));
app.post('/update', function (req, res) {
    var id1 = req.body.id1;
    var id2 = req.body.id2;
    var intencoes = req.body.intencoes;
    var entidades = req.body.entidades;
    var dialogo = req.body.dialogo;
    var username = process.env.CONVERSATION_USER
    var password = process.env.CONVERSATION_PASS
    var conversation = new watson.ConversationV1(
        {
            username: username,
            password: password,
            version_date: '2017-05-26'
        });
    var params =
        {
            workspace_id: id2,
            export: true
        };
    conversation.getWorkspace(params, function (err, response2) {
        if (err) {
            console.error(err);
        } else {
            var wsname2 = response2.name;
            var fs = require('fs');
            var dt = new Date();
            console.log('vai salvar!');
            fs.writeFile('bkps/' + id2 + '_' + dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + '-' + dt.getHours() + '-' + dt.getMinutes(), JSON.stringify(response2), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('salvou bkp workspace!');
                    var params =
                        {
                            workspace_id: id1,
                            export: true
                        };
                    conversation.getWorkspace(params, function (err, response1) {
                            if (err) {
                                            console.error(err);
                                        } else {
                                            console.log(response1.name);
                                    var source = response1;
                                    var wsname1 = response1.name;
                                    var varElementos = "( ";
                                    if (intencoes) {
                                        var varElementos = varElementos + " \"intenções\" ";
                                        var params =
                                            {
                                            workspace_id: id2,
                                            intents: source.intents
                                        };
                                    conversation.updateWorkspace(params, function (err, response3) {
                                        if (err) {
                                            console.error(err);
                                        }
                                    });
                                };
                                if (entidades) {
                                    var varElementos = varElementos + " \"entidades\" ";
                                    var params =
                                        {
                                            workspace_id: id2,
                                            entities: source.entities
                                        };
                                    conversation.updateWorkspace(params, function (err, response3) {
                                        if (err) {
                                            console.error(err);
                                        }
                                    });
                                };
                                if (dialogo) {
                                    var varElementos = varElementos + " \"dialogo\" ";
                                    var params =
                                        {
                                            workspace_id: id2,
                                            dialog_nodes: source.dialog_nodes
                                        };
                                    conversation.updateWorkspace(params, function (err, response3) {
                                            if (err) {
                                                console.error(err);
                                            }
                                        }
                                    );
                                }
                                ;
                                var varElementos = varElementos + " )";
                                var respFull = {"nome1": wsname1, "nome2": wsname2, "nome3": varElementos};
                                res.send(respFull)

                            }
                        }
                    );
                }
            });
        }
    });
});
var port = process.env.PORT || 3002
app.listen(port, function () {
    console.log('servidor on na porta: ' + port);
});