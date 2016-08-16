/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var SPACE_FACTS = [
    "Think about a time when you really enjoyed the company you were with. Who were they? What were you doing? Why did you enjoy it? Spend some time writing about your experience.",
    "Write a letter to yourself 5 years from now. Describe what you would like to remember, what you hope to have accomplished and what you would like to say to the you who is five years older.",
    "What can you do, with your skills and abilities, that could make a difference in someone's life. Write about your abilities and your passions and create a plan to use those skills and passions for the good of someone else.",
    "Write about the last time you gave someone a gift, how did the person react? How did it make you feel?",
    "Today is you leave for a new destination. What are you taking? What are you leaving behind.",
    "Think about a favorite book that you have read. Why is it your favorite? What feelings did you have as you were reading the book? What was your favorite part?",
    "Think about the last time you were sad or upset. What was it that upset you? Are you still upset about it? Write for a few minutes about how you can find happiness today, and what you may have learned from that experience.",
    "Do you have anything that you want to do that you haven't shared with anyone? What are those dreams or goals? Why haven't you told anyone? What can you do today to move in the direction of your dreams.",
    "What is the most fun you have ever had? When was it? Why was it so fun?",
    "Write about 3 things that really irritate you. Why are they so irritating to you?",
    "What is the last dream you remember. Try to recall as much of the dream as possible as your journaling exercise today. ",
    "Do You believe in God? What is your current understanding or belief in the Divine?",
    "Describe your plan for the next 3 years. What do you want to accomplish? What will you do to get there.",
    "What is your favorite childhood memory? What makes it memorable, who was there? Where did it happen? Describe this memory in as much detail as possible.",
    "When was the last time you laughed out loud. Describe the situation and what about it made you laugh.",
    "What new thing did you learn this week? Describe what you have learned in a way that would help teach someone else.",
    "Spend some time today writing about your first job. What was it? How did you get the job? What were you hired to do?",
    "If money and time were no object, what would you do? what profession would you have? How would you spend your time?",
    "Describe what makes you unique to this world. What are you skills, passions and talents that have made you special?",
    "Make a list of 10 things that make you smile. Why do they make you smile and how can you do more of it.",
    "Take some time to describe what unconditional love looks like and feels like to you. How can you express unconditional love in your life today?",
    "Think of the last time you made a big mistake. Describe the situation and what did you learn from it?",
    "Write a letter to yourself, telling you what you need hear. Think about all the things you wish someone would say to you and write a letter to yourself describing this.",
    "What are you grateful for? take several minutes to describe what you are grateful for and how you can express gratitude more today.",
    "Write today about what forgiveness means to you. Do you have anyone in your life that needs your forgiveness. Do you have a situation you would like forgiveness for. Take several minutes to write about this.",
    "Journal about your perfect weekend. What would you do, who would spend it with? What about this weekend makes it special."
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SpaceGeek = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SpaceGeek.prototype = Object.create(AlexaSkill.prototype);
SpaceGeek.prototype.constructor = SpaceGeek;

SpaceGeek.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("JournalPrompt onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("JournalPrompt onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SpaceGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("JournalPrompt onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceGeek.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
            console.log("JournalPrompt GetNewFactIntent called sessionId: " + session.sessionId);
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        console.log("JournalPrompt helpIntent called sessionId: " + session.sessionId);
        response.ask("Daily Journal Prompt will provide you daily writing ideas to help you find unique things to journal about and help you maintain a daily practice of writing. You can ask Journal Prompt for a writing prompt or you can say tell me a writing idea. You can also say cancel... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        console.log("JournalPrompt stop called: " + session.sessionId);
        var speechOutput = "Thank you for using Journal Prompt. Make journaling a daily practice. Until next time.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        console.log("JournalPrompt cancel called: " + session.sessionId);
        var speechOutput = "Thank you for using Journal Prompt. Make journaling a daily practice. Until next time.";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    console.log("JournalPrompt handleNewFactRequest");
    var factIndex = Math.floor(Math.random() * SPACE_FACTS.length);
    var fact = SPACE_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your journal prompt: " + fact;

    response.tellWithCard(speechOutput, "Daily Journal Prompt", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var spaceGeek = new SpaceGeek();
    spaceGeek.execute(event, context);
};

