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
    "I do not believe in evil. I believe in Good. I do not believe in sin. I believe in Truth. I do not believe in want. I believe in Abundance. I do not believe in death. I believe in Life. I do not believe in ignorance. I believe in Intelligence. There are no discords in my being. Being is peace. My faith, understanding, and love are becoming one. What therefore God hath joined together, let not man put asunder.",
    "As we realize that we are God's children, that we have power and authority to think and to speak the good and true and to have it manifest in harmonious relations and pleasant surroundings, we no longer invite or submit to inharmony, misunderstandings, or limitations. We place ourselves in God's keeping, and think Truth, and it directs us in ways of peace and pleasantness.",
    "Pray for understanding. Claim your oneness with God. Study your relationship with Him so that you may know how to lay hold of the abundant life, intelligence, substance, and love, so that you can build these into your soul, and your body, to perfect your expression.",
    "Set aside regular periods every day for prayer, times that are most convenient for you. Use words of Truth during your silence periods. As you change your thinking and bring it into line with Truth principles, a transformation will take place in your consciousness. Your mind will become keen, awake, alert, illumined, and your body temple will be filled with new life. You will be inspired with new and practical ideas that will enable you to succeed in a larger way.",
    "When we have found the kingdom of God, and the richness of it, we come into touch with the allness of the one Ruler whose throne is within. Then we have no more trouble about things. Things come just as naturally as the planted seed grows.",
    "INSPIRATION, enthusiasm, strength, joy, and outer supply come to you in ever-increasing measure as you depend upon the only Source there is for your sufficiency. As you establish divine order in your thought world within, as you find your home in Christ, the Truth, you are bound to find your right environment, the place that the Father has prepared for you, in which to serve Him and develop your soul.",
    "We are not to be too concerned with the appearances of inharmony, lack, and imperfection about us. These things are not real, and they will pass away quickly as Truth takes hold in the consciousness. We are to remember that the Light shines in the darkness --- and that in the very midst of the darkness, man's mind opens to the Light, and for him there is no more darkness.",
    "God is helping you now to know that this is the Truth. God is showing you that your best dreams are coming true; that you are to forget the past and its disappointments; that you are to do everything as though you were doing it for God. God is a great,loving Father, Who is interested in you, and Who can, and will help you. He will supply your needs, and will show you how to keep happy and healthy.",
    "The silence is a kind of stillness, a place of retreat into which we may enter, and having entered, may know the Truth. We go into the silence by observing the instructions, Be still, and know (Psalms. 46 10). The only way really to know is to become perfectly still, to get away from the outer, and from looking for things, into the inner, quiet where we are alone with wisdom. In the silence, wisdom is given for every need.",    
	"In the silence we get the wonderful inward joy that is of God. We see what the real is. Those who seek pleasure in the outer are in reality seeking eternal joy: the joy that no man can take away, the joy that Jesus Christ promised us, the joy that comes when we know what it means to be a child of God, when we know what the Father would have us know.",
    "Let us make these thoughts a part of our consciousness: I cannot be afraid, for God is omnipresent Good. God is omnipresent protection. I will fear no evil; for thou art with me.",
	"Everything in God's world is working toward perfection. The restoring power of God in the midst of you is working quickly and harmoniously to build in cells and substance that will knit together whatever place needs rebuilding.",
	"Make up your mind that you are going to see God everywhere, and you will begin to discern the God qualities expressing in everyone and everything, however imperfectly. Be determined to listen for, and hear God's voice and the radiation of God's power, and love, and the sounds that once disturbed will not affect you. Instead they will impress you with the fact that God's life, and power, and love, are in everything and are seeking expression.",
	"Pray for your innate, and unlimited faith in God to be quickened and stirred into positive action. With your eye of faith, see yourself continuously manifesting purity, harmony, and wholeness in every part of your body.",
	"Now let us start anew, knowing that the Father has given into our keeping, all the possibilities that understanding grasps. Our blessings are so great, and so many that there is no emptiness anywhere in us. If we wish to do noble things we can do them where we are; if we wish to become great we have the opportunity to do great deeds just where we are. Living the Good, using the Good, knowing the power of the Good to make itself supreme, will transform every home, no matter what the conditions may be, into a home of righteousness, plenty, and joy.",
	"THERE ARE no square pegs in round holes. You are where you are because there is a need to be supplied, perhaps in the way of lessons in the positive development of the faculties that will enable you to get out of the present place into a more desirable one. If it seems to you that you are a square peg in a round hole, make yourself fit into the hole you are in, or else get into another one. Don't stay there, rattling around and getting nowhere.",
	"You have everything you need to enable you to do the many things you came into the world to do, but you need to let the Spirit of God take hold of your soul and set it to doing its perfect work in the body. This will require the exercise of good, common sense. Look at your chest: it breathes in the very breath of God's life; God is flowing through it to supply all your needs. Look at your limbs and feet: God has created them to enable you to walk on the earth (which He created for you) and to move about freely and to do that which gives you practical knowledge of the laws governing life on this plane. Look at your arms and hands: they are God's, and He has continued to dwell in them and sustain them all during these years. Your head is wonderfully poised, so that you may look about and see the beauty, and power, and life, and light of God manifested in His creation everywhere.",
	"The only way to become permanently prosperous and successful is through quickening, awakening, and bringing into righteous use all the indwelling resources of Spirit. When we develop our soul and express its talents and capabilities in loving service to God and humankind, our temporal needs will be supplied in bountiful measure. We have access to the realm of rich ideas; we enrich our consciousness by incorporating these rich ideas into it. A rich consciousness always demonstrates prosperity.",
	"It is not enough to pray. Prayer is one step that you take, but you need other steps. You need to think of God, the all-powerful Healer, as being already within you, in every part of your mind, heart, and body. To keep one's attention and prayers in the spiritual realm of mind, without letting them work out into the soul's expression and into the actual physical doing of that which corresponds with what the mind and heart has thought and spoken and prayed, is to court trouble. To keep declaring love and power and life and substance, and yet unconsciously, perhaps, assuming limitations and living them, will cause explosions and congestion that work out in the physical. We need to harmonize our thinking and our prayers with actual living experiences.",
	"Each one of us is inseparably one with God, the source and substance of life and wisdom and every good. Each one must draw upon the source for his own substance, and for his own light, and for his own will power. ",
	"The body is like a child. It needs constant prompting and training and discipline and praise and appreciation. Your body needs your attention, your love, your training. Give all your thought and your love and your determination to perfecting your body. Look at that wonderful body temple. It is precious to you. Begin to see that body the instrument of the soul, which enables you to carry out God's plans in the earth.",
    "THANKSGIVING AND GRATITUDE are qualities of the soul too little understood and exercised. Heaven and earth listen and respond to the soul that is quickened into praise and thanksgiving. Praise is gratitude in action. Try it in your home.",
	"Be still. Be still. Be still. God in the midst of you is substance. God in the midst of you is love. God in the midst of you is wisdom. Let not your thoughts be given to lack, but let wisdom fill them with the substance and faith of God. Let not your heart be a center of resentment and fear and doubt. Be still and know that at this moment it is the altar of God, of love; love so sure and unfailing, love so irresistible and magnetic that it draws your supply to you from the great storehouse of the universe. Trust God, use God's wisdom, prove and express God's love. ",
	"The more you think about the Christ within, the stronger will grow your consciousness of the divine presence and your oneness with Him, until you can 'be still, and know', until you can still all the outer thoughts and meditate upon 'Christ in you, the hope of glory.' Many have been helped mightily, gloriously in finding the silence, by repeating 'Jesus Christ' time after time, with short intervals between. ",
	"So, let us go to the Source of all help, all life, all supply, and all opportunity, and build up the consciousness of health and plenty. Instead of struggling in an outer way, let us go within, and build a foundation for real success, and prosperity, and satisfaction.",
    "Use affirmations similar to the following for the purpose of setting your mind in order, and setting into action the thought causes which will bring the desired results. Affirm to yourself,  I, too, will arise and go to my Father, and receive His love, and wisdom, and blessing. I now, behold His kingdom, His riches, and His unfailing life pouring through me, and manifesting for all my needs."
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
    console.log("MyrtleFillmore onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

SpaceGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SpaceGeek onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechText = "Welcome to Myrtle Fillmore's Thoughts on Truth. You can use this skill to ask for a daily thought from Myrtle Fillmore, the co-founder of Unity. You can say what's the thought of the day, or you can say exit. Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
SpaceGeek.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MrytlFillmore onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

SpaceGeek.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
    var speechText = "You can use this skill to ask for a daily thought from the writings of Myrtle Fillmore, the co-founder of Unity. To hear a thought of the day you can say things like give me a thought on truth, or what's the thought of the day. You can also say tell me the thought of the day, or you can say exit. Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, say help me.";
    response.ask(speechText, repromptText);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "You are a child of God, Be Happy and Be Blessed.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "You are a child of God, Be Happy and Be Blessed.";
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
    var speechOutput = "Here's a thought from Myrtle Fillmore. " + fact;

    response.tellWithCard(speechOutput, "Myrtle Fillmore", speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var spaceGeek = new SpaceGeek();
    spaceGeek.execute(event, context);
};

