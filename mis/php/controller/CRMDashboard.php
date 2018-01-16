<?php
include("functions/Custom.php");

class CRMDashboard //extends MController
{
    use Custom;

    function __construct()
    {
        $this->DB = pg_connect("host=" . HOST . " dbname=" . DATABASE . " user=" . USER . " password=" . PASSWORD . " port=" . PORT) or die('could not connect');
    }

    function sample($data1, $data2)
    {
        $booking = pg_query("select id,password from res_users");
        $data = array();
        while ($row = pg_fetch_assoc($booking)) {
            $data[$row['id']] = $row;
        }
        print_r(json_encode($data));
    }

    function sidebar()
    {
        sleep(0);
        $dir = "../views/sample";
        $return_array = array();
        if (is_dir($dir)) {
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) != false) {
                    if ($file == "." or $file == "..") {
                    } else {
                        $return_array[] = $file;
                    }
                }
            }
            echo json_encode($return_array);
        } else {
            echo "Nothing Fond";
        }
    }

	// login
    function login($data1, $data2)
    {
		$postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $mobile = $request->username;
        $password = $request->password;
        $password = $password;
		$sql = "select fnchecklogin user_name from (select fnchecklogin('{$mobile}', '{$password}')) as aaa";
        $login = pg_query($sql);
        $checklogin = pg_fetch_array($login);
        //echo $checklogin; exit;
        $val = ["status" => "success", "key" => $checklogin];
        if (!empty($checklogin['user_name']))
        {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else
        {
            echo '{"status":"fail"}';
        }

    }

	// profile
    function profile(){
        $request = json_decode($_POST['slim'][0]);
		$val = ["status" => "success", "data" => $request->output->image];
		if($request->output->image){
			print_r(json_encode($val));
		}else{
			echo '{"status":"fail"}';
		}
    }

    function crm_panel_main_level()
    {
		$postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
		$user = $request->user_name;		
		$sql_userdet = "SELECT res_users.id FROM res_users inner join res_partner on (res_partner.id=res_users.partner_id)where res_partner.name = '".$user."'";
		$res_userdet = pg_query($sql_userdet);
		$row_userdet = pg_fetch_row($res_userdet);
		$sql = "select fnkgcrm_enquiry($row_userdet[0],0,0,'',-1,0,0)";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0].") as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		while($row1= pg_fetch_row($res1))
		{
			$datas[$i]['label'] = $row1[0];
			$datas[$i]['parameter_id'] = $row1[1];
			$datas[$i]['value'] = $row1[2];
			$datas[$i]['columnname'] = $row1[3];
			$datas[$i]['level'] = 1;
			$datas[$i]['user_id'] = $row_userdet[0];
			$i++;
		}
		$val = ["status" => true, "key" => $datas];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}


    function crm_first_level_table_http_function(){
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->columnname;
        $parameter_id = $request->parameter_id;
        $user_id = $request->user_id;
        //print_r($request);
        $sql = "select fnkgcrm_enquiry($user_id,$level,0,'$columnname',1,0,$parameter_id)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);
        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();        
        $sn =0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 			
			for($i=0;$i<count($exp);$i++)
			{	
				$lower_val = strtolower($exp[$i]);
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
			} 			
         $sn++;            
        }
        //print_r($datas);
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val));
        } else {
            echo '{"status":"fail"}';
        }
    }
    
    
    function crm_second_level_table_http_function()
    {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->type_name;
        $enquiry_id = $request->link_id;
        $sql = "select fnkgcrm_enquiry(0,0,0,'$columnname',$level,0,$enquiry_id)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        
        //~ $exp = explode('~', $columnheader);
       // $i =0;
        $sn =0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 			
			for($i=0;$i<count($exp);$i++)
			{	
				$lower_val = strtolower($exp[$i]);
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
			} 	
         $sn++;
            
        }
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val));
        } else {
            echo '{"status":"fail"}';
        }
    }
    
    function crm_third_level_table_http_function()
    {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->type_name;
        $enquiry_id = $request->link_id;
        $sql = "select fnkgcrm_enquiry(0,0,0,'$columnname',$level,0,$enquiry_id)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();

        $sn =0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 			
			for($i=0;$i<count($exp);$i++)
			{	
				$lower_val = strtolower($exp[$i]);
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
			} 	
         $sn++;
            
        }
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val));
        } else {
            echo '{"status":"fail"}';
        }
    }
    
    // CRM Module End
    
    //PPC Module Start 
    function ppc_panel_main_level()
    {
		$sql = "select fnkgproduction_summary(0,0,0,'',-1,0,0)";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0]." ) as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		while($row1= pg_fetch_row($res1))
		{
			//print_r($row1);
			$datas[$i]['value'] = $row1[0];
			$datas[$i]['label'] = $row1[1];
			$datas[$i]['columnname'] = $row1[2];
			$datas[$i]['level'] = 1;
			$i++;
		}
		//print_r($datas); 
		$val = ["status" => true, "key" => $datas];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}
	
	function ppc_first_level_table_http_function()
	{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->columnname;
        //~ $parameter_id = $request->parameter_id;
        $sql = "select fnkgproduction_summary(0,$level,0,'$columnname',1,0,0)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
		
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        //~ $exp = explode('~', $columnheader); 
        $sn =0;$i=0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 
			
			for($i=0;$i<count($exp);$i++)
			{	
				//~ echo "</pre>";		
				$lower_val = strtolower($exp[$i]);
				//~ echo $lower_val;
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
			}				
			//~ for($i=0;$i<count($exp);$i++)
			//~ {	
				//~ $datas[$sn][$exp[$i]] = $row1[$i];	
			//~ }	
			
         $sn++;            
        }
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val)); 
        } else {
            echo '{"status":"fail"}';
        }
    }
    
    //PPC Module End
    
    //Purchase Module Start
    
     function purchase_panel_main_level()
    {
		$sql = "select fnkgpurchase(0,0,0,'',-1,0,0)";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0]." ) as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		while($row1= pg_fetch_row($res1))
		{
			$datas[$i]['value'] = $row1[0];
			$datas[$i]['label'] = $row1[1];
			$datas[$i]['columnname'] = $row1[2];
			$datas[$i]['level'] = 1;
			$i++;
		}
		//print_r($datas); 
		$val = ["status" => true, "key" => $datas];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}
	
	function purchase_all_level_table_http_function()
	{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->columnname;
        $sql = "select fnkgpurchase(0,$level,0,'$columnname',1,0,0)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
		
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        //~ $exp = explode('~', $columnheader); 
        $sn =0;$i=0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 				
			for($i=0;$i<count($exp);$i++)
			{	
				//~ echo "</pre>";		
				$lower_val = strtolower($exp[$i]);
				//~ echo $lower_val;
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
			}	
			
         $sn++;            
        }
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val)); 
        } else {
            echo '{"status":"fail"}';
        }
    }
    
	//Purchase Module End
	
	
	//Permission Module Start
    
     function user_lists()
    {
		$sql = "select fndashboardmodulerights(1,1,'','')";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0]." ) as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		
		$sql_mod = "select fndashboardmodulerights(1,2,'','')";
		$res_mod = pg_query($sql_mod);
		$row_mod = pg_fetch_row($res_mod);
		$sql1_mod = "select * from (".$row_mod[0]." ) as aaa where aaa.module_level = 0";
		$res1_mod = pg_query($sql1_mod);
		$datas_mod = array();
		$j=1;
		while($row1= pg_fetch_row($res1))
		{
			$datas[$i]['id'] = $row1[0];
			$datas[$i]['modulename'] = $row1[1];
			$datas[$i]['level'] = 1;
			$i++;
		}
		while($row1_mod= pg_fetch_row($res1_mod))
		{
			$inc_submodulelist_qry = "select module_id,parent_id, module_name, display_name, path, module_level, module_order from (" .$row_mod[0] .") as a where a.parent_id='".$row1_mod[0]."'" ; 
			$submodulelist_execute2 = pg_query($inc_submodulelist_qry);
			$k = 1; 
			while($row_of_submodulelist = pg_fetch_array($submodulelist_execute2))
			{
				$datas_mod[$j]['subtitle'][$k] = $row_of_submodulelist;
				$k++;
			}
			$datas_mod[$j]['moduleid'] = $row1_mod[0];
			$datas_mod[$j]['parentid'] = $row1_mod[1];
			$datas_mod[$j]['modulename'] = $row1_mod[2];
			$datas_mod[$j]['displayname'] = $row1_mod[3];
			$datas_mod[$j]['modulelevel'] = $row1_mod[5];
			$datas_mod[$j]['moduleorder'] = $row1_mod[6];
			$datas_mod[$j]['level'] = 1;
			$j++;
		}
		//print_r($datas_mod); 
		$val = ["status" => true, "key" => $datas, "key_mod" => $datas_mod];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}
	
	function save_user_lists()
	{
		$postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        print_r($request);    
	}
	//Permission Module End
	
	//Warehouse Module Start
    
     function warehouse_panel_main_level()
    {
		$sql = "select fnkgwarehouse(0,0,0,'',-1,0,0)";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0]." ) as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		while($row1= pg_fetch_row($res1))
		{
			$datas[$i]['value'] = $row1[0];
			$datas[$i]['label'] = $row1[1];
			$datas[$i]['columnname'] = $row1[2];
			$datas[$i]['level'] = 1;
			$i++;
		}
		//print_r($datas); 
		$val = ["status" => true, "key" => $datas];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}
	
	function warehouse_all_level_table_http_function()
	{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->columnname;
        $sql = "select fnkgwarehouse(0,$level,0,'$columnname',1,0,0)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
		
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        //~ $exp = explode('~', $columnheader); 
        $sn =0;$i=0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 				
			//print_r($exp); echo "<br>"; 
			for($i=0;$i<count($exp);$i++)
			{	
				//~ echo "</pre>";		
				$lower_val = strtolower($exp[$i]);
				//~ echo $row1[$lower_val];
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
				//print_r($datas[$sn][$exp[$i]]); echo "<br>";
			}	
			
         $sn++;            
        }
        //print_r($datas); 
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val)); 
        } else {
            echo '{"status":"fail"}';
        }
    }
    
	//Warehouse Module End
	
	//Accounts Module Start
    
     function accounts_panel_main_level()
    {
		$sql = "select fnkgaccounts(0,0,0,'',-1,0,0)";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0]." ) as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		while($row1= pg_fetch_row($res1))
		{
			$datas[$i]['value'] = $row1[0];
			$datas[$i]['label'] = $row1[1];
			$datas[$i]['columnname'] = $row1[2];
			$datas[$i]['level'] = 1;
			$i++;
		}
		//print_r($datas); 
		$val = ["status" => true, "key" => $datas];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}
	
	function accounts_all_level_table_http_function()
	{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->columnname;
        $sql = "select fnkgaccounts(0,$level,0,'$columnname',1,0,0)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
		
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        //~ $exp = explode('~', $columnheader); 
        $sn =0;$i=0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 				
			//print_r($exp); echo "<br>"; 
			for($i=0;$i<count($exp);$i++)
			{	
				//~ echo "</pre>";		
				$lower_val = strtolower($exp[$i]);
				//~ echo $row1[$lower_val];
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
				//print_r($datas[$sn][$exp[$i]]); echo "<br>";
			}	
			
         $sn++;            
        }
        //print_r($datas); 
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val)); 
        } else {
            echo '{"status":"fail"}';
        }
    }
    
	//Accounts Module End
	
	//HR Module Start
    
     function hr_panel_main_level()
    {
		$sql = "select fnkghr(0,0,0,'',-1,0,0)";
		$res = pg_query($sql);
		$row = pg_fetch_row($res);
		$sql1 = "select * from (".$row[0]." ) as aaa";
		$res1 = pg_query($sql1);
		$datas = array();
		$i=1;
		while($row1= pg_fetch_row($res1))
		{
			$datas[$i]['value'] = $row1[0];
			$datas[$i]['label'] = $row1[1];
			$datas[$i]['columnname'] = $row1[2];
			$datas[$i]['level'] = 1;
			$i++;
		}
		//print_r($datas); 
		$val = ["status" => true, "key" => $datas];
        if (!empty($datas)) {
            print_r(json_encode($val)); // '{"status":"success","key":"'.json_encode($checklogin).'"}';
        } else {
            echo '{"status":"fail"}';
        }
	}
	
	function hr_all_level_table_http_function()
	{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = $request->level;
        $columnname = $request->columnname;
        $sql = "select fnkghr(0,$level,0,'$columnname',1,0,0)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
		
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        //~ $exp = explode('~', $columnheader); 
        $sn =0;$i=0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 				
			//print_r($exp); echo "<br>"; 
			for($i=0;$i<count($exp);$i++)
			{	
				//~ echo "</pre>";		
				$lower_val = strtolower($exp[$i]);
				//~ echo $row1[$lower_val];
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
				//print_r($datas[$sn][$exp[$i]]); echo "<br>";
			}	
			
         $sn++;            
        }
        //print_r($datas); 
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val)); 
        } else {
            echo '{"status":"fail"}';
        }
    }
    
	//HR Module End
	
	//MD FollowUp Screen Start 
	
	function followup_all_level_table_http_function()
	{
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $level = 1;
        $columnname = 'followup';
        $sql = "select fnkgfollowup(0,$level,0,'$columnname',1,0,0)";
        $res = pg_query($sql);
        $row = pg_fetch_row($res);

        $pgsql_hr2 = pg_query($row[0]);
		$row2 =pg_fetch_array($pgsql_hr2);
		$columnheader = $row2['columnheader'];
		
        $sql1 = "select * from (".$row[0]." ) as aaa";
        $res1 = pg_query($sql1);
        $datas = array();
        //~ $exp = explode('~', $columnheader); 
        $sn =0;$i=0;
        while($row1= pg_fetch_array($res1))
        {
			$exp = explode(',', $row1['columnheader']); 				
			for($i=0;$i<count($exp);$i++)
			{	
				//~ echo "</pre>";		
				$lower_val = strtolower($exp[$i]);
				//~ echo $lower_val;
				$datas[$sn][$exp[$i]] = $row1[$lower_val];
			}	
			
         $sn++;            
        }
        $val = ["status" => true, "key" => $datas, "head_val" => $columnheader];
        if (!empty($datas)) {
            print_r(json_encode($val)); 
        } else {
            echo '{"status":"fail"}';
        }
    }
    
	//MD FollowUp Screen End
	
    
    
}
