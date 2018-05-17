OPTIONS http://localhost:8080/rest/status HTTP/1.1
Origin: http://localhost
Access-Control-Request-Method: POST
Access-Control-Request-Headers: origin, content-type, x-request-with

###

POST http://localhost:8080/rest/workbook/create HTTP/1.1
content-type: application/json

{
    "txId": 1,
    "action": {
        "pathname": "/path/to/workbook"
    }
}

###

POST http://localhost:8080/rest/sheet/add HTTP/1.1
content-type: application/json

{
    "txId": 1,
    "action": {
        "sheetName": "sheet1",
        "index": 0
    }
}

###

POST http://localhost:8080/rest/sheet/cell/update HTTP/1.1
content-type: application/json

{
    "txId": 1,
    "action": {
        "sheetName": "sheet1",
        "rowIndex": 0,
        "colIndex": 0,
        "value": {
            "type": 1,
            "decimalValue": 1024
        }
    }
}

###

POST http://localhost:8080/rest/sheet/cell/update HTTP/1.1
content-type: application/json

{
    "txId": 1,
    "action": {
        "sheetName": "sheet1",
        "rowIndex": 0,
        "columnIndex": 1,
        "formulaString": "A1*4"
    }
}

###

POST http://localhost:8080/rest/sheet/row/insert HTTP/1.1
content-type: application/json

{
    "txId": 1,
    "action": {
        "sheetName": "sheet1",
        "rowIndex": 0,
        "nRows": 1
    }
}


{txId: 1, statusCode: 1, message: "当前无打开的工作簿！", content: null}

