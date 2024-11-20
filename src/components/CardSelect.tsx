import React, { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export enum Suit {
  SPADE = "♠",
  HEART = "♥",
  DIAMOND = "♦",
  CLUB = "♣",
}

export type CardT = {
  suit: Suit.SPADE | Suit.HEART | Suit.DIAMOND | Suit.CLUB;
  value: string;
};

const SUITS = [Suit.SPADE, Suit.HEART, Suit.DIAMOND, Suit.CLUB] as const;
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

const generateDeck = (): CardT[] => {
  const deck: CardT[] = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit: suit as CardT["suit"], value });
    }
  }
  return deck;
};

const CardSelect = ({
  selectedCards,
  setSelectedCards,
}: {
  selectedCards: CardT[];
  setSelectedCards: (value: CardT[]) => void;
}) => {
  const deck = generateDeck();

  const handleCardToggle = (card: CardT) => {
    if (
      selectedCards.some((c) => c.suit === card.suit && c.value === card.value)
    ) {
      setSelectedCards(
        selectedCards?.filter(
          (c) => !(c.suit === card.suit && c.value === card.value),
        ),
      );
    } else if (selectedCards?.length < 6) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Select up to 6 Cards</h2>
        <p className="text-sm text-gray-500">
          Selected: {selectedCards.length}/6
        </p>
      </div>
      <div className="grid grid-cols-[repeat(13,_minmax(0,_1fr))] gap-2">
        {deck.map((card) => (
          <Toggle
            key={`${card.suit}-${card.value}`}
            pressed={selectedCards.some(
              (c) => c.suit === card.suit && c.value === card.value,
            )}
            onPressedChange={() => handleCardToggle(card)}
            disabled={
              selectedCards.length >= 6 &&
              !selectedCards.some(
                (c) => c.suit === card.suit && c.value === card.value,
              )
            }
            className={cn(
              "h-12 w-8 flex flex-col items-center justify-center text-sm",
              card.suit === Suit.HEART || card.suit === Suit.DIAMOND
                ? "text-red-500"
                : "text-black",
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
            )}
          >
            <div>{card.value}</div>
            <div className="-mt-4 text-xl">{card.suit}</div>
          </Toggle>
        ))}
      </div>
    </div>
  );
};

export default CardSelect;
