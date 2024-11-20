"use server";
import { anthropicClient, type Message } from "@/lib/anthropic";

export async function getMessages(messages: Message[], message: string) {
  const response = await anthropicClient.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    system: "You are an expert at playing the card game of Cribbage",
    messages: [...messages, { role: "user", content: message }],
  });
  return response;
}

export async function askCribDiscard(cards: string, isDealer: string) {
  // Replace placeholders like {{isDealer}} with real values,
  // because the SDK does not support variables.
  const msg = await anthropicClient.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    system:
      'You are an expert at playing the card game Cribbage. You must respond with valid JSON only. But please format the analysis string using html and tailwind. Use just the letter of the card for word value cards, A for Ace, J for Jack, Q for Queen, K for King. Format the Hearts and Diamond suits with their respective card name/number with text-red-500. No other text is allowed. {"analysis": string, "keepRecommendation": [{"value": string, "suit": string}], "discardRecommendation": [{"value": string, "suit": string}]}\',',

    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "<examples>\n<example>\n<HAND>\n9♣, 8♦, 4♥, 3♣, Ace♦, 7♦\n</HAND>\n<isDealer>\ntrue\n</isDealer>\n<ideal_output>\nAce ♦, Three ♣\n</ideal_output>\n</example>\n<example>\n<HAND>\n5♥, 10♣ 7♥, 9♥, Queen♥\n</HAND>\n<isDealer>\nfalse\n</isDealer>\n<ideal_output>\n10 ♣\n</ideal_output>\n</example>\n</examples>\n\n",
          },
          {
            type: "text",
            text: `You are an AI assistant tasked with helping a player form an optimal cribbage hand. In cribbage, players are dealt five or six cards and must discard two to form their four-card hand. The goal is to keep the four cards that have the highest potential for scoring points.\n\nThe discarded cards go into an extra hand called the "crib". The player that is dealing the round gets to add that had to their points. So obviously they want to put cards from their hand that may benefit the crib as well. The opposing player(s) will want to place low value cards there.\n\nThe game is played with two or three players. With two players they are dealt six cards each. With three players they are dealt five cards each and an additional card is put in the crib at random by the dealer. The player must keep four cards in their hand. If they are only dealt five cards they only discard one card. If they are dealt six card they discard two cards.\n\n<Dealer>\n${isDealer}\n</Dealer>\n\n\n<hand>\n${cards}\n</hand>\n\nTo form an optimal cribbage hand, consider the following factors:\n1. Pairs, triplets, and four-of-a-kind\n2. Runs (sequences of three or more consecutive cards)\n3. Fifteens (combinations of cards that add up to 15, with face cards counting as 10 and aces as 1)\n4. Flushes (all four cards of the same suit)\n5. Nobs (a jack of the same suit as the starter card, which is not known at this point)\n\nAnalyze the given hand and determine which two cards should be discarded to create the best possible four-card cribbage hand. Consider all possible combinations and their scoring potential.\n\nProvide your reasoning for the selection, explaining why the chosen four-card hand is optimal and how it has the potential to score points. Then, state your final recommendation for which two cards to discard.\n\nPresent your analysis and recommendation in the following format:\n\nIn the recommendation use the following symbols to represent each suits:\n  SPADE = ♠\n  HEART = ♥\n  DIAMOND = ♦\n  CLUB = ♣\n\n\n<analysis>\n[Your detailed analysis of the hand and reasoning for your selection]\n</analysis>\n\n<keepRecommendation>\n[First card to keep], [Second card to keep], [Third card to keep], [Fourth card to keep]\n</keepRecommendation>\n\n<discardRecommendation>\n[First card to discard], [Second card to discard]\n</discardRecommendation>\n\nRemember to consider all aspects of cribbage scoring when making your decision, and aim to maximize the potential points for the four-card hand.`,
          },
        ],
      },
    ],
  });
  return msg;
}
