<?php
class MController{
    function __construct() 
	{    
		$this->DB = pg_connect("host=".HOST." dbname=".DATABASE." user=".USER." password=".PASSWORD." port=".PORT) or die('could not connect');
	
	}
}
?>