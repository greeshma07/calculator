var flag = true;
var errorMessage;
var msg1 = "Please provide a valid entry";
var msg2 = "Grouping is not supported.";
$(document).ready(function() {	
	document.getElementById("equation").value = ""; 
	$('#pic').hide();
    $('#toggle-event').prop('checked', false);
	$('#keypad').hide();
	$('#equation').on("keyup keypress", function(e) {
		var code = e.keyCode || e.which; 
		if (code === 13) { 
			calculate();
		}
	});
	 $('#toggle-event').change(function() {
		if($(this).prop('checked'))
			showKeyPad('block');
		else
			showKeyPad('none');
    })
});

function calculate(){	
	var input=document.getElementById('equation').value;
	input = input.replace(/^0+(?!\.|$)/, '')
	if(validate(input)){
		var result = calculateResult(input);
		if(!isNaN(result)){
			document.getElementById('equation').value = result;
			flag = false;
		}
		else{
			$('#pic').show();
			document.getElementById("equation_err").innerHTML= msg1;	
		}	
	}
	else{
		$('#pic').show();
		document.getElementById("equation_err").innerHTML=errorMessage;	
	}	
}

//validating the user input
function validate(input){	
	var flag1,flag2;
	var pattern = /[^0-9.+\-*/]+/i;
	flag1=pattern.test(input);
   	if(input == "")
	{
		errorMessage = msg1;
		return false;
	}	
	else if(input.endsWith('+') || input.endsWith('-') || input.endsWith('*') || input.endsWith('/')){
		errorMessage = msg1;
		return false;
	}	
	else if(input.startsWith('*') || input.startsWith('/') || input.startsWith('--') || input.startsWith('++')){
		errorMessage = msg1;
		return false;
	}	
	else if(input.indexOf("**") != -1 || input.indexOf("*/") != -1 || input.indexOf("/*") != -1 ||  input.indexOf("//") != -1){
		errorMessage = msg1;
		return false;
	}
	else if(input.indexOf("(") != -1 || input.indexOf("*)") != -1){
		errorMessage = msg2;
		return false;
	}
	else if(flag1)
	{
		errorMessage = msg1;
		return false;
	}		
	else
	{
	  document.getElementById("equation_err").innerHTML=""; 
	  $('#pic').hide();
	}
	return true;
}	

function clearFunction(){
	document.getElementById("equation").value = ""; 
	document.getElementById("equation_err").innerHTML = ""; 
	$('#pic').hide();
}

function showKeyPad(statusflag) {
    var x = document.getElementById('keypad');
	x.style.display = statusflag;    
}

function addVal(keyValue){	
	if(!flag && keyValue !== "+" && keyValue !== "-" && keyValue !== "*" && keyValue !== "/"){
		document.getElementById("equation").value = "";
	}
	flag = true;
	if(document.getElementById("equation_err").innerHTML !== ""){
		document.getElementById("equation_err").innerHTML = "";
		$('#pic').hide();
	}
	document.getElementById("equation").value += keyValue;
}

function deleteVal(){
	if(document.getElementById("equation_err").innerHTML !== ""){
		document.getElementById("equation_err").innerHTML = ""; 
		$('#pic').hide();
	}
	if(flag){
		var input=document.getElementById('equation').value;
		document.getElementById("equation").value=input.substring(0,input.length-1);
	}	
}

/*Calculating the arithmetic equation/expression without using JavaScript eval() function */
function calculateResult(input){
	var items = [];
	var operators = ["/","*"];
	var result =0;
	var str = "";
	var inputIndex = 0;
	if(input[inputIndex] === "+" || input[inputIndex] === "-"){
		str =str + input[inputIndex];			
		inputIndex++;
		while(inputIndex < input.length && "+-*/".indexOf(input[inputIndex]) === -1){
			str =str + input[inputIndex];			
			inputIndex++;
		}
		items.push(str);
		str = "";
	}
	if(inputIndex === input.length){
		return input;
	}
	for(var i = inputIndex; i< input.length; i++){		
		str = str + input[i];
		if(input[i] === "+" || input[i] === "-" || input[i] === "*" || input[i] === "/"){
			if(input[i+1] === "+" || input[i+1] === "-"){
				items.push(str);
				str = "";
				i = i+1;
				str = str + input[i];
				while("+-*/".indexOf(input[i+1]) === -1){
					str = str + input[i+1];					
					i++;
					if(i === input.length-1){
						break;
					}
				}				
				items.push(str);
				str = "";
			}
			else{
				items.push(str);
				str = "";
			}			
		}
		else{
			if(i === input.length-1){
				items.push(str);
				str = "";
			}
			else if(input[i+1] === "+" || input[i+1] === "-" || input[i+1] === "*" || input[i+1] === "/"){
				items.push(str);
				str = "";
			}
		}
	}
	opIndex = 0;
	var op = operators[opIndex];
	while(items.length > 1){		
		while(opIndex < 2 && items.indexOf(op) !== -1){
			var i = items.indexOf(op);
			if(op === "/"){
				result = parseFloat(items[i-1]) / parseFloat(items[i+1]);
			}
			else if(op === "*"){
				result = parseFloat(items[i-1]) * parseFloat(items[i+1]);
			}
			items.splice(i-1, 3, result);
			result = 0;
		}
		opIndex++; 
		if(items.length > 1 && opIndex === 1){
			op = operators[opIndex];
		}
		else if(items.length > 1 && opIndex >= 2){
			if(items[1] === "+"){
				result = parseFloat(items[0]) + parseFloat(items[2]);
			}
			else if (items[1] === "-"){
				result = parseFloat(items[0]) - parseFloat(items[2]);
			}
			items.splice(0, 3, result);
			result = 0;
		}
	}
	return items[0];
}