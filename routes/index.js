
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.query.array){
		var result = fixArray(req.query.array);
		res.render('indexwithresult', {result: result});
	}
	else{
		res.render('index');
	}
};

function LinkedList(parent, value){
	this.parent = parent;
	this.value = value;
	this.initialValue = value;
	this.child = null;
	this.testValue = value;

	if(this.parent != null){
		this.parent.setChild(this);
	}

	this.setChild = function(child){
		this.child = child;
	}

	this.getCurrentCost = function(){
		return this.value - this.initialValue;
	}

	this.setValue = function(value){
		this.value = value;
	}

	this.testCost = function(value){
		return value - this.initialValue;
	}

	this.testFixHighestCost = function(value){
		var testValue = value;
		if(testValue < this.value){
			testValue = this.value;
		}
		var testCost = this.testCost(testValue);
		var childResult = testCost;
		if(this.child != null){
			childResult = this.child.testFixHighestCost(parseFloat(testValue) + 1);
		}
		if(testCost < childResult){
			return childResult;
		}
		else{
			return testCost;
		}
	}

	this.testFixLowestCost = function(value){
		var testValue = value;
		if(testValue < this.value){
			testValue = this.value;
		}
		var testCost = this.testCost(testValue);
		var childResult = testCost;
		if(this.child != null){
			childResult = this.child.testFixLowestCost(parseFloat(testValue) + 1);
		}
		if(testCost > childResult){
			return childResult;
		}
		else{
			return testCost;
		}
	}

	this.getLastChild = function(){
		if(this.child !== null){
			return this.child;
		}
		else{
			return this;
		}
	}

	this.cascadeSet = function(value){
		if(value > this.value){
			this.value = value;
		}	
		if(this.child != null){
			this.child.cascadeSet(parseFloat(this.value) + 1);
		}
	}

	this.cascadeAdjust = function(adjustment){
		this.value = parseFloat(this.value) + adjustment;
		if(this.child != null){
			this.child.cascadeAdjust(adjustment);
		}
	}

	this.report = function(){
		if(this.child != null){
			return [[this.value,this.getCurrentCost()]].concat(this.child.report());
		}
		else{
			return [[this.value,this.getCurrentCost()]];
		}
	}
}

var fixArray = function(arrayQuery){
	var array = arrayQuery.split(',');
	var head = null;
	var lastItem = null;
	for(var i = 0; i < array.length; i++){
		if(i == 0){
			head = new LinkedList(null, array[i]);
			lastItem = head;
		}
		else{
			lastItem = new LinkedList(lastItem, array[i]);
		}
	}

	var result = {array: array, arrayQuery: arrayQuery};

	result.highestCost = head.testFixHighestCost(head.value);
	result.lowestCost = head.testFixLowestCost(head.value);

	result.bestCost = Math.ceil((result.highestCost - result.lowestCost) / 2)

	head.cascadeSet(head.value);
	head.cascadeAdjust(-result.bestCost);

	result.fixedArray = head.report();

	var last = head.getLastChild();

	return result;
}