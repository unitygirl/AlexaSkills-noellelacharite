/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Minecraft Helper how to make paper."
 *  Alexa: "(reads back recipe for paper)"
 */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    recipes = require('./recipes');

var APP_ID = undefined; //OPTIONAL: replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var STATES = [
    "Alabama
"Alaska
"Arizona
"Arkansas
"California
"Colorado
"Connecticut
"Delaware
"Florida
"Georgia
"Hawaii
"Idaho
"Illinois
"Indiana
"Iowa
"Kansas
"Kentucky
"Louisiana
"Maine
"Maryland
"Massachusetts
"Michigan
"Minnesota
"Mississippi
"Missouri
"Montana
"Nebraska
"Nevada
"New Hampshire
"New Jersey
"New Mexico
"New York
"North Carolina
"North Dakota
"Ohio
"Oklahoma
"Oregon",
"Pennsylvania",
"Rhode Island",
"South Carolina",
"South Dakota",
"Tennessee",
"Texas",
"Utah",
"Vermont",
"Virginia",
"Washington",
"West Virginia",
"Wisconsin",
"Wyoming"
]
/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HowTo = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HowTo.prototype = Object.create(AlexaSkill.prototype);
HowTo.prototype.constructor = HowTo;

HowTo.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to State Capital Flash Cards. I will tell you a state and give you a chance to tell me the capital. If you cannot, I will provide you with the right answer. ... Are you ready to begin?"
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

HowTo.prototype.intentHandlers = {
    "StateIntent": function (intent, session, response) {},
    "AMAZON.YesIntent": function (intent, session, response) {
         var itemSlot = intent.slots.AMAZON.US_State,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value;
        }

        var cardTitle = "Capital of " + itemName + " is: ",
            recipe = recipes[itemName],
            speechOutput,
            repromptOutput;
        if (recipe) {
            speechOutput = {
                speech: recipe,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, recipe);
        } else {
            var speech;
            if (itemName) {
                speech = "I'm sorry, I do not recognize " + itemName + " as a capital. Would you like to try another state?";
            } else {
                speech = "I'm sorry, I do not recognize that state. Would you like to try another state?";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help with?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using State Capitals Flash Cards.";
        response.tell(speechOutput);
    },
    "AMAZON.NoIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using State Capitals Flash Cards.";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Thanks for using State Capitals Flash Cards.";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "This is the State Capitals Flash Card Skill. You can say the name of any state and Alexa will pause while you think of the answer and then tell you the capital. What state would you like to start with?";
        var repromptText = "You can say things like, What's the capital of New York, simply say the state you want to know the capital for, or you can say cancel... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    }
};

function handleNewStateRequest(response) {
    // Get a random space fact from the space facts list
    var stateIndex = Math.floor(Math.random() * STATES.length);
    var state = STATES[stateIndex];

    // Create speech output
    var speechOutput = "What's the capital of  " + state;
    var repromptSpeech = "Last chance, what is the capital of " + state;
    response.ask(speechOutput, repromptSpeech);
}
exports.handler = function (event, context) {
    var howTo = new HowTo();
    howTo.execute(event, context);
};
