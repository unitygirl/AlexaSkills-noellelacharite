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

var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var SPACE_FACTS = [
    "You call forth the gifts of God within you and you are blessed with happiness, success and true achievement.",
    "Each new dawn opens to you new opportunities, new joys, deeper understanding, and a greater faith in your divine potential.",
	"You boldly move forward with courage and faith.",
    "Through the power of the indwelling Christ, divine order is now established in your mind and body and in all the circumstances of your life.",
    "There is one Presence and on Power in your life, God, the good, omnipotent.",
    "You are one with the freedom of Spirit.  You are triumphant, glorious, splendid, and free!",
    "You are an illumined expression of God filled with divine love and wisdom.  You are guided and directed in right ways.",
    "You joyously live each day receptive to God’s infinite good.",
    "Joy is your true nature.  You see goodness all around you and joy bubbles up from within.",
    "God has given you a spirit of love, serenity, joy and contentment.  All is well with you, and you are at peace.",
    "The spirit of God is working in and through you, and you are prospered in all ways.",
    "God goes before you this day to guide, to guard, to govern, and to protect you.  All is well.",
    "You are an ever-renewing, ever-unfolding expression of infinite life.",
    "The Christ within is your strength and wisdom.  You are confident, courageous, and free.",
    "You are a radiant, all-wise, all-loving triumphant child of God.  Infinite wisdom guides you, divine love prospers you, and you are successful in all you do.",
    "You are grateful for the abundance of life, love, wisdom and prosperity in your life.  You give and receive in a spirit of joy.",
    "You fairly sizzle with zeal and enthusiasm and spring forth with a mighty faith to do the things that ought to be done by you."

];
/**
 * MinecraftHelper is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var MinecraftHelper = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
MinecraftHelper.prototype = Object.create(AlexaSkill.prototype);
MinecraftHelper.prototype.constructor = MinecraftHelper;

MinecraftHelper.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    var speechText = "Welcome to Silent Unity Skill for Amazon Alexa. You can say things like, tell me a prayer for comfort or healing? ... Now, how may we pray with you?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

MinecraftHelper.prototype.intentHandlers = {
    "PrayerIntent": function (intent, session, response) {
        var itemSlot = intent.slots.Item,
            itemName;
        if (itemSlot && itemSlot.value){
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = "A Prayer for you:  " + itemName,
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
                var factIndex = Math.floor(Math.random() * SPACE_FACTS.length);
                var fact = SPACE_FACTS[factIndex];

                // Create speech output
                var speechOutput = "I could not find a prayer for that. Here is a general prayer for you, " + fact;
                response.tellWithCard(speechOutput, "A Prayer for you: ", speechOutput);
            }
         else {
                var factIndex = Math.floor(Math.random() * SPACE_FACTS.length);
                var fact = SPACE_FACTS[factIndex];

            // Create speech output
                var speechOutput = "I could not find a prayer for that. Here is a general prayer for you, " + fact;
                response.tellWithCard(speechOutput, "A Prayer for you: ", speechOutput);
            }
            }
    },
    "GeneralPrayerIntent": function (intent, session, response) {
                var factIndex = Math.floor(Math.random() * SPACE_FACTS.length);
                var fact = SPACE_FACTS[factIndex];

                // Create speech output
                var speechOutput = fact;
                response.tellWithCard(speechOutput, "A Prayer for you: ", speechOutput);
            },
    
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "For one on one free, confidential prayer,  please call us at 1-800-NOW-PRAY.  For additional prayers, meditations and other spiritual resources, visit silent unity dot org  or download our uPray mobile app. Thank you.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "For one on one free, confidential prayer,  please call us at 1-800-NOW-PRAY.  For additional prayers, meditations and other spiritual resources, visit silent unity dot org  or download our uPray mobile app. Thank you.";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "This skill provides prayers to guide you through daily life. You can say things such as, tell me a prayer for gratitude, or you can say cancel... Now, what can I help you with?";
        var repromptText = "You can say things like, say a prayer for healing, or you can say cancel... Now, what can I help you with?";
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

exports.handler = function (event, context) {
    var minecraftHelper = new MinecraftHelper();
    minecraftHelper.execute(event, context);
};
