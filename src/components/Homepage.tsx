"use client";
import React from "react";
import CardSelect, { type CardT } from "./CardSelect";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { askCribDiscard } from "@/actions/anthropic";
import { LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suit } from "@/components/CardSelect";

const WaitingSpinner = () => {
  return <LoaderCircleIcon className="animate-spin" />;
};

const CardList = ({ cards }: { cards: CardT[] }) => {
  return (
    <div className="flex gap-1">
      {cards.map((card) => (
        <div
          key={card.value + card.suit}
          className={cn(
            "h-12 w-8 flex flex-col items-center justify-center text-sm shadow",
            card.suit === Suit.HEART || card.suit === Suit.DIAMOND
              ? "text-red-500"
              : "text-black",
          )}
        >
          <div>{card.value}</div>
          <div className="-mt-2 text-xl">{card.suit}</div>
        </div>
      ))}
    </div>
  );
};

const Homepage = () => {
  const [selected, setSelected] = React.useState<CardT[]>([]);
  const [dealer, setDealer] = React.useState<boolean>(false);
  const [content, setContent] = React.useState("");
  const [keep, setKeep] = React.useState<CardT[]>([]);
  const [discard, setDiscard] = React.useState<CardT[]>([]);
  const [responsePopOpen, setResponsePopOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutate: sendCards, isPending } = useMutation({
    mutationFn: async ({
      cards,
      isDealer,
    }: {
      cards: string;
      isDealer: boolean;
    }) => askCribDiscard(cards, isDealer.toString()),
    onSuccess: (data) => {
      const assistantMessage = data.content
        .filter((content) => content.type === "text")
        .map((content) => content.text)
        .join("");

      const parsedMessage = JSON.parse(assistantMessage);
      console.log(parsedMessage);
      setContent(parsedMessage.analysis);
      setKeep(parsedMessage.keepRecommendation as CardT[]);
      setDiscard(parsedMessage.discardRecommendation as CardT[]);
      setResponsePopOpen(true);

      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const handleClick = () => {
    if (selected.length < 5) return;
    const cardstring = selected.reduce(
      (acc, current) => acc + current.value + current.suit + ",",
      "",
    );
    setContent("");
    setKeep([]);
    setDiscard([]);
    console.log(cardstring);
    sendCards({ cards: cardstring, isDealer: dealer });
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      <CardSelect selectedCards={selected} setSelectedCards={setSelected} />
      <div className="flex items-center justify-center gap-2">
        <Button onClick={handleClick} disabled={isPending}>
          Check
        </Button>
        <div className="items-top flex space-x-2">
          <Checkbox
            checked={dealer}
            onCheckedChange={(value) => setDealer(Boolean(value))}
            id="dealerCheckbox"
          />
          <Label htmlFor="dealerCheckbox">My Crib</Label>
        </div>
      </div>
      <Card className="grow">
        <CardHeader>
          <CardTitle hidden>Text results from ai</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ScrollArea
            className={cn(
              "w-full h-full grow",
              isPending
                ? "justify-center align-middle"
                : "justify-start align-top",
            )}
          >
            {isPending ? (
              <WaitingSpinner />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      <Dialog
        open={responsePopOpen}
        onOpenChange={(value) => setResponsePopOpen(value)}
        modal={true}
      >
        <DialogContent className="w-100">
          <div className="flex flex-col gap-2">
            <Card>
              <CardContent>
                <div>Keep</div>
                <CardList cards={keep} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div>Discard</div>
                <CardList cards={discard} />
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Homepage;
