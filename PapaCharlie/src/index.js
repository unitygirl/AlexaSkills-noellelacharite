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
var APP_ID = "amzn1.echo-sdk-ams.app.9817668d-0a9c-43e2-ba12-ceb9ff045ab3"; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var SPACE_FACTS = [
    "But Jesus said, God is Spirit. He also said, 'The kingdom of God is within you.' Science tells us that there is a universal life that animates and sustains all the forms and shapes of the universe. Science has broken into the atom, and revealed it to be charged with tremendous energy that may be released, and be made to give the inhabitants of the earth, powers beyond expression, when its law of expression is discovered.",
    "Our Bible plainly teaches that God implanted in man, His perfect image and likeness, with executive ability to carry out all the creative plans of the Great Architect. When man arrives at a certain point in spiritual understanding, it is his office to co-operate with the God principle in creation. Jesus had reached this point, and He said, My Father worketh even until now, and I work.",
    "The mind is the seat of perception of the things we see, hear, and feel.  It is through the mind, that we see the beauties of the earth and sky, or music, of art, in fact, of everything.  That silent shuttle of thought working in and out through cell and nerve, weaves into one harmonious whole the myriad moods of mind, and we call it life.",
    "Imagination gives the man the ability to project himself, through time and space, and rise above all limitations.",
    "The Inexhaustible Resource of Spirit is equal to every demand. There is no reality in lack. Abundance is here and now manifest.",
    "The one and only formative power given to man is thought. By his thinking he not only makes character, but body and affairs, for 'as he thinketh, within himself, so is he.",
    "All causes are essentially mental, and whosoever comes into daily contact with a high order of thinking must take on some of it.",
    "There is an invisible thought-stuff on which the mind acts, making things through the operation of a law not yet fully understood by man. Every thought moves upon this invisible substance in increasing or diminishing degree. When we praise the richness and fullness of God, this thought-stuff is tremendously increased in our mental atmosphere. It reflects into everything that our mind, and our hands touch.",
    "It is the childlike mind that finds the kingdom.",
    "People who accomplish great things in the industrial world are the ones who have faith in the money producing power of ideas.",
    "Words are also seeds, and when dropped into the invisible spiritual substance, they grow and bring forth after their kind.",
    "There are opportunities everywhere, just as there have always been.",
    "Here is a mental treatment guaranteed to cure every ill, that flesh is heir to. Sit for half an hour every night, and mentally forgive everyone against whom you have any ill will, or antipathy.",
    "We increase whatever we praise. The whole creation responds to praise, and is glad.",
    "The spiritual substance, from which comes all visible wealth, is never depleted. It is right within you all the time, and responds to your faith in it, and your demands on it.",
    "Divine Mind is the one, and only reality.",
    "I refuse to be anxious about tomorrow, or even the next minute. I know that God does provide for the fulfillment of His divine idea, and I am that divine idea.",
    "Justus means just, upright. One definition of “just”, is “conforming to the spiritual law . . . righteous before God.” Justus signifies that in man’s religious consciousness which truly worships God, which conforms to divine law.",
    "You must first enter into the understanding that God, omnipresent, omnipotent, and omniscient, is the source and that you can draw on this source without limit.",
    "The true church is not made of creeds and forms, nor is it contained in walls of wood and stone; the heart of man is its temple and the Spirit of truth is the one guide into all Truth. When men learn to turn within to the Spirit of truth, who is in each one for his light and inspiration, the differences between the churches of man will be eliminated, and the one church will be recognized.",
    "man’s bodily condition depends on his state of mind. No two persons the same age are in exactly the same bodily condition. This shows that years do not make man young or old. For as he thinketh within himself, so is he. Proverbs 23 7.",
    "Right here and now the great work of character-building is to be done, and whoever neglects present opportunities, looking forward to a future heaven for better conditions, is pulling right away from the kingdom of heaven within himself.",
    "Man should constantly affirm: I AM, and I will manifest, the perfection of the Mind within me. The first part of the statement is abstract Truth; the second part is concrete identification of man with this Truth.",
    "We must learn the law of expression from the abstract to the concrete--from the formless to the formed. Every idea makes a structure after its own image and likeness, and all such ideas and structures are grouped and associated according to their offices.",
    "The mind has eyes, and we can see (perceive) the inner intelligence when we look with mind. But those who look wholly with the physical eye, are really blind. Having eyes, they see not. Man's salvation from sin, sickness, pain, and death comes by his understanding, and conforming to the orderly Mind back of all existence. Ye shall know the truth, and the truth shall make you free.",
    "Thought is the creative power by which man builds a mentality and a body of perfection. Man understandingly uses his creative thought power by mentally perceiving the right relation of ideas.",
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
    console.log("PappaCharlie onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("PapaCharlie onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SpaceGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("PapaCharlie onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceGeek.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("This skill allows you to ask for a random quote by Charles Fillmore. You can say Papa Charlie tell me a quote, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Think Good Thoughts and Have a Nice Day!";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Think Good Thoughts and Have a Nice Day";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * SPACE_FACTS.length);
    var fact = SPACE_FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your quote from Charles Fillmore: " + fact;

    response.tellWithCard(speechOutput, "Charles Fillmore Says:", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var spaceGeek = new SpaceGeek();
    spaceGeek.execute(event, context);
};

