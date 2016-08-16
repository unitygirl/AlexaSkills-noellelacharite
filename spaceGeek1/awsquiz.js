 var speechOutput = "";
    var sessionAttributes = {};
    var gameInProgress = session.attributes && session.attributes.questions;
    var answerSlotValid = isAnswerSlotValid(intent);
    var userGaveUp = intent.name === "DontKnowIntent";
    var cardTitle = "AWS Quiz for the Certified Solution Architect Associate Exam",
        speechOutput = "";

    var answerSlot = intent.slots.Answer;
    // If the user provided answer isn't a number > 0 and < 5,
    // return an error message to the user
    if (!answerSlot || !answerSlot.value || isNaN(parseInt(answerSlot.value))
        || !(parseInt(answerSlot.value) < ANSWER_COUNT+1 && parseInt(answerSlot.value) > 0)) {
        speechOutput = "Your answer must be a number between 1 and 4."
        callback(session.attributes,
            buildSpeechletResponse(cardTitle, speechOutput, speechOutput, false));
    }
    else {
        // If the user responded with an answer but there is no practice test in progress, ask the user
        // if they want to start a new practice test
        if (!session.attributes || !session.attributes.questions) {
            speechOutput = "There is no practice test in progress. To start a new practice test, say, " +
                "start a practice test.";
            callback(session.attributes,
                buildSpeechletResponse(cardTitle, speechOutput, speechOutput, false));
        }
        else {
            var testQuestions = session.attributes.questions,
                correctAnswerIndex = parseInt(session.attributes.correctAnswerIndex),
                currentScore = parseInt(session.attributes.score),
                currentQuestionIndex = parseInt(session.attributes.currentQuestionIndex),
                correctAnswerText = session.attributes.correctAnswerText;

            var speechOutputAnalysis = "";
            if (parseInt(answerSlot.value) == correctAnswerIndex) {
                currentScore++;
                speechOutputAnalysis = "correct, Congratulations!";
            } else {
                speechOutputAnalysis = "not quite right. The correct answer is " + correctAnswerText + ". ";
            }
            // if currentQuestionIndex is 4, we've reached 5 questions (zero-indexed) and can exit the practice test session
            if (currentQuestionIndex == GAME_LENGTH - 1) {
                speechOutput = "That answer is " + speechOutputAnalysis + "You got " +
                    currentScore.toString() + " out of " + GAME_LENGTH.toString() + " questions correct. Thank you for practicing with AWS! For more information, visit our website at aws.amazon.com/certification.";
                callback(session.attributes,
                    buildSpeechletResponse(cardTitle, speechOutput, "", true));
            }
            else {
                currentQuestionIndex += 1;
                var spokenQuestion = Object.keys(questions[testQuestions[currentQuestionIndex]])[0];
                // Generate a random index for the correct answer, from 0 to 3
                correctAnswerIndex = Math.floor(Math.random() * (ANSWER_COUNT));
                var roundAnswers = populateRoundAnswers(testQuestions, currentQuestionIndex, correctAnswerIndex),

                    questionIndexForSpeech = currentQuestionIndex + 1,
                    repromptText = "Question " + questionIndexForSpeech.toString() + ". " + spokenQuestion + " ";
                for (var i = 0; i < ANSWER_COUNT; i++) {
                    repromptText += (i+1).toString() + ". " + roundAnswers[i] + ". "
                }
                speechOutput += "That answer is " + speechOutputAnalysis + "Your score is " + currentScore.toString() + ". " + repromptText;

                var sessionAttributes = {
                    "speechOutput": repromptText,
                    "repromptText": repromptText,
                    "currentQuestionIndex": currentQuestionIndex,
                    "correctAnswerIndex": correctAnswerIndex + 1,
                    "questions": testQuestions,
                    "score": currentScore,
                    "correctAnswerText":
                        questions[testQuestions[currentQuestionIndex]][Object.keys(questions[testQuestions[currentQuestionIndex]])[0]][0]
                };
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, false));
            }
        }
    }
}
