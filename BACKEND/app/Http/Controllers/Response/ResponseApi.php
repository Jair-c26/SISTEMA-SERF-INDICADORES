<?php
namespace App\Http\Controllers\Response;

class ResponseApi
{

    protected $message;
    protected $status;
    protected $token;
    protected $data;

    public function __construct()
    { 
        $this->message="";
        $this->status=0;
        $this->token = "";
        $this->data=[];
    }

    public function success($message = "success" ,$status = 200,$data, $token = ""){

        $this->message = $message;
        $this->status = $status;
        $this->token = $token;
        $this->data = $data;

        $dataJson = [
            "message" => $this->message,
            "status" => $this->status,
            "token" => $this->token,
            "data" => $this->data
        ];
        
        return response()->json($dataJson,$status);
    }

    public function error($message = "error" ,$status = 400,$data=[]){

        $this->message = $message;
        $this->status = $status;
        $this->data = $data;
        $dataJson = [
            "message" => $this->message,
            "status" => $this->status,
            "data" => $this->data
        ];
        
        return response()->json($dataJson,$status);
    }
}
