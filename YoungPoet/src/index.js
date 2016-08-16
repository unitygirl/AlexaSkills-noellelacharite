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
var APP_ID = undefined;

/**
 * Array containing space facts.
 */
var SPACE_FACTS = [
    "Twinkle, twinkle, little star! How I wonder what you are. Up above the world so high, Like a diamond in the sky. When the glorious sun is set, When the grass with dew is wet, Then you show your little light, Twinkle, twinkle all the night. In the dark-blue sky you keep, And often through my curtains peep, For you never shut your eye, Till the sun is in the sky. As your bright and tiny spark, Guides the traveller in the dark. Though I know not what you are, Twinkle, twinkle, little star!",
    "Thirty days has September. April, June, and November. February has twenty-eight alone. All the rest have thirty-one. Except leap-year, that's the time, When February's days are twenty-nine.",
    "Wee Willie Winkie, runs through the town. Up-stairs and down-stairs, in his night-gown. Rapping' at the window, crying through the locks, Are the children in their beds?—for it's now eight o'clock.",
    "Whatever brawls disturb the street, There should be peace at home; Where sisters dwell and brothers meet, Quarrels should never come. Birds in their little nests agree; And 'tis a shameful sight, When children of one family Fall out, and chide, and fight.",
    "Baa, baa, black sheep, have you any wool? Yes sir, yes sir, three bags full. One for my master, one for my dame, And one for the little boy that lives in our lane. Baa, baa, black sheep, have you any wool? Yes sir, yes sir, three bags full.",
    "Dickery dickery dock! The mouse ran up the clock; The clock struck one, and the mouse ran down, Dickery, dickery, dock!",
    "Bye, baby bunting, Father's gone a-hunting, Mother's gone a-milking, Sister's gone a-silking. Brother's gone to buy a skin, To wrap the baby bunting in.",
    "Early to bed, and early to rise, Is the way to be healthy, wealthy, and wise.",
	"Humpty Dumpty sat on a wall, Humpty Dumpty had a great fall; All the king's horses, and all the king's men, Couldn't set Humpty Dumpty up again.",
	"Jack and Jill went up the hill, To fetch a pail of water; Jack fell down and broke his crown, And Jill came tumbling after. Up Jack got, and home did trot, As fast as he could caper; Jill had the job to wrap his head, With vinegar and brown paper.",
	"Jack be nimble, Jack be quick, And Jack jump over the candlestick.",
	"Jack Sprat could eat no fat, His wife could eat no lean; And so between them both, you see, They licked the platter clean.",
	"Old Mother Hubbard, Went to the cupboard, To get her poor Dog a bone; But when she came there, The cupboard was bare, And so the poor Dog had none.",
	"Little Bo-peep has lost her sheep, And cannot tell where to find them; Leave them alone, and they'll come home, And bring their tails behind them.",
    "Little Boy Blue, come, blow me your horn; The sheep's in the meadow, the cow's in the corn. Where's the little boy that looks after the sheep? He's under the haystack, fast asleep.",
	"Little Jack Horner sat in a corner, Eating a Christmas pie; He put in his thumb, and he took out a plum, And said, 'What a good boy am I!'",
	"Little Miss Muffett, She sat on a tuffett, Eating her curds and whey; Along came a little spider, Who sat down beside her, And frightened Miss Muffett away.",
	"Mary, Mary, quite contrary, How does your garden grow? Silver bells and cockle-shells, And pretty maids all in a row.",
	"To market, to market, to buy a fat pig, Home again, home again, jiggety jig. To market, to market, to buy a fat hog, Home again, home again, jiggety jog.",
    "Hot cross buns, hot cross buns, One a penny, two a penny, Hot cross buns. If your daughters don't like them, Give them to your sons, One a penny, two a penny, Hot cross buns.",
    "Pat-a-cake, pat-a-cake, baker's man, Bake me a cake as fast as you can; Prick it and pat it, and mark it with B; And put it in the oven for Baby and me.",
	"Georgie, Porgie, pudding and pie, Kiss'd the girls and made them cry. When the girls came out to play, Georgie Porgie ran away.",
	"Pease pudding hot, Pease pudding cold, Pease pudding in the pot, Nine days old. Some like it hot, Some like it cold, Some like it in the pot, Nine days old.",
    "Rain, rain, Go away, Come again another day; Little Johnny Wants to play. Rain, Rain, go away.",
	"Goosey, goosey, gander. Whither shall I wander? Up stairs, and down stairs, and in my lady's chamber. There I met an old man, who wouldn't say his prayers, I took him by his left leg, and sent him down the stairs.",
    "Hey diddle diddle, the cat and the fiddle. The cow jumped over the moon; The little dog laughed to see such sport, And the dish ran after the spoon."
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
    console.log("YoungPoet onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("YoungPoet onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
   console.log("YoungPoet onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechText = "Welcome to the Young Poet Skill. You can use this skill to ask for a daily childrens poem or rhyme. You can say what's the poem of the day, or you can say help. Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SpaceGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("YoungPoet onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceGeek.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "Here are some tips for using this skill. You can say Young Poet, tell me a today's rhyme, or tell me the poem of the day. You can also say exit... What can I help you with?";
        var repromptText = "You can say things like, tell me the poem of the day, or you can say exit... Now, what can I help you with?";
        response.ask(speechText, repromptText);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "A Poem a day, keeps the blues away. Thanks for using Young Poet.";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "A Poem a day, keeps the blues away. Thanks for using Young Poet.";
        response.tell(speechOutput);
    }      
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleLaunchRequest(response) {
    console.log("YoungPoet onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechText = "Welcome to the Young Poet Skill. You can use this skill to ask for a daily children's poems and rhymes. You can say what's the poem of the day, or you can say exit. Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
}
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * SPACE_FACTS.length);
    var fact = SPACE_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's Your Poem: " + fact;
    response.tellWithCard(speechOutput, "Young Poet", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var spaceGeek = new SpaceGeek();
    spaceGeek.execute(event, context);
};

