/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

var Speech = require('./lib/speech');
var syl = require('./lib/syllables');
var Vocabulary = require('./lib/vocabulary');

var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var vocabulary = new Vocabulary();

/**
 * DrSpeech is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var DrSpeech = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DrSpeech.prototype = Object.create(AlexaSkill.prototype);
DrSpeech.prototype.constructor = DrSpeech;


DrSpeech.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speech = new Speech();
    speech.say("Welcome to State Capitals Flash Cards. Let's Begin Your Session.");
    speech.pause("1s");
    speech.say("Are you ready?");
    var reprompt = "Are you ready for the lesson?";

    response.ask(speech.toObject(), reprompt);
};


DrSpeech.prototype.intentHandlers = {
    // register custom intent handlers
    "CategoryIntent": function (intent, session, response) {

        var speech = new Speech();

        var slots = intent.slots;
        var categorySlot = slots.Category;
        if (categorySlot === undefined || categorySlot === null) {
            response.ask("Please choose a category first. Do you want to practice on states, or capitals?");
            return;
        }
        var categoryWord = categorySlot.value;
        session.attributes.chosenCategory = categoryWord;

        if (categoryWord !== "states" && categoryWord !== "capitals") {
            response.ask("Please choose a provided category. Do you want to practice on states or capitals?");
            return;
        }

        else if (categoryWord === "states" || categoryWord === "capitals") {
           var itemSlot = intent.slots.State,
            stateName;
        if (itemSlot && itemSlot.value){
            stateName = itemSlot.value.toLowerCase();
        }
         var cardTitle = "Capital for " + stateName,
            recipe = recipes[stateName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: recipe,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, recipe);
            session.attributes.saveWord = recipe;
            // need to save session attribute saveWord here because this is where theRandomWord was generated

            speech.say("Great");
            speech.pause("1s");
            speech.say("You want to practice on " + categoryWord);
            speech.pause("1s");
            speech.say("What's the capital of " + stateName + "?");
        }
    }

        var reprompt = "What's the capital of " + stateName + "?";

        response.ask(speech.toObject(), reprompt);
    
 },

    "AnswerIntent": function (intent, session, response) {

        var speech = new Speech();
        var capital = intent.slots.Word.value;

        var slots = intent.slots;
        var categorySlot = session.attributes.chosenCategory;
        if (categorySlot === undefined || categorySlot === null) {
            response.ask("Please choose a category first. Do you want to practice on nouns, verbs or adjectives?");
            return;
        }

        else if (capital === session.attributes.saveWord) {
            speech.say("Correct.");
            speech.pause("1s");
            speech.say("The capital is");
            speech.say("capital.");
        }

        else if (word !== session.attributes.saveWord) {
            speech.say("That was not correct. I didn't hear a captial I recognized.");
        }
        var reprompt = "Do you want to continue?";
        response.ask(speech.toObject(), reprompt);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("This skill will help you learn the state capitals. When you are ready to begin, the skill will ask you for the capital of a randomly selected state. Based on your answers, you will be told that you are correct or incorrect.", "What cateogry do you want to practice? States or Capitals?");
    },

    "AMAZON.YesIntent": function (intent, session, response) {
        // response.tell("Yes");
        var reprompt = "Please tell me what category of words you want to practice on? You can choose states or capitals.";
        response.ask("Please tell me what category of words you want to practice on? You can choose states or capitals.", reprompt);
    },

    "AMAZON.NoIntent": function (intent, session, response) {
        response.tell("I hope you enjoyed learning more about US State Capitals. Goodbye!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the DrSpeech skill.
    var helloWorld = new DrSpeech();
    helloWorld.execute(event, context);
};
