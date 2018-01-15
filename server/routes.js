module.exports = app => {

	const Typo = require("typo-js");
	const dictionary = new Typo("en_US");

	var questions = [];

	app.get('/', (req, res) => {
		res.sendfile('./public/index.html');
	});

	app.get('/data', (req, res) => {
		res.json(questions);
	});

	app.post('/askquestion', (req, res) => {
		
		//initiate some default answer for boti
		var botiAnswers = [ {
			userName : "Boti",
			text : "Don't be lazy! search up!"
		},
			{
				userName : "Boti",
				text : "It won't kill u to help yourself once in a while"
			},
			{
				userName : "Boti",
				text : "I'll get back to u in Oct 32"
			}
		];
		
		var included = false; //indicates if the question has already asked before
		var gotSpelled = false; //indicates if the string has misspelled
		
		var body = req.body;
		
		//checking each word in the question and correct typos:
		var spellingCheck = function(string) {
			words = string.split(" ");
			for (var i = 0; i < words.length; i++) {
				if (!dictionary.check(words[i])) {
					var suggestions = dictionary.suggest(words[i]);
					if (suggestions.length > 0){
						words[i] = suggestions[0];
						gotSpelled = true;
					}
				}
			};

			str = words.join(" ");
			return str;
		}

		body.text = spellingCheck(body.text);

		//this will be the final possible answers if the question has already asked before
		var answers = [];

		//looping the questions array
		questions.forEach(function(question) {
			//found a question that has already asked in that way or another:
			if ((question.text.includes(body.text)) || body.text.includes(question.text)) {
				//Run on all the answers for the specific quest and build options for the bot:
				for (var j = 0; j < question.answers.length; j++) {
					botiAnswers.push({
						userName : "Boti",
						text : question.answers[j].text
					});
				}
				//add indication about typos in the answers
				if(gotSpelled){
					botiAnswers.forEach(function(ans){
						if (!ans.text.includes("CHECK YOUR SPELLING ASS!"))
							ans.text += " AND CHECK YOUR SPELLING ASS!";
					});
				}
				
				//choose random answer for boti
				var randomAns = Math.floor(Math.random() * botiAnswers.length);
				answers.push(botiAnswers[randomAns]);
				included = true;
			}
		});
		//write the quest to the questions list
		if (!included) {
			//indicate new question with typos:
			if(gotSpelled){
				body.answers.push({userNAme: "Boti",
									text: "CHECK YOUR SPELLING ASS!"});
			}
			questions.push(body);
		}
		else{
			//generate random answer from the possible answers
			randomAns = Math.floor(Math.random() * answers.length);
			questions.push({
				userName : body.userName,
				text : body.text,
				answers : [answers[randomAns]]
			});
		}

		//update the questions
		res.json(questions);
	});

	app.post('/addanswer', (req, res) => {
		var body = req.body;
		//add the new answer
		questions[body.index].answers.push({
			userName : body.userName,
			text : body.text
		})

		//update the questions
		res.json(questions);
	});
};