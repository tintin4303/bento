"use client";

import { useState, ReactNode } from "react";
import { HamburgerMenu, MenuButton } from "./HamburgerMenu";
import { Modal } from "./Modal";
import { Inbox, Utensils, ChefHat, Users } from "lucide-react";

interface ChefMenuProps {
  feedbackNode: ReactNode;
  dishRequestNode: ReactNode;
  profileNode: ReactNode;
  guestsNode: ReactNode;
}

export function ChefMenu({ feedbackNode, dishRequestNode, profileNode, guestsNode }: ChefMenuProps) {
  const [activeModal, setActiveModal] = useState<"feedback" | "requests" | "profile" | "guests" | null>(null);

  return (
    <>
      <HamburgerMenu>
        <MenuButton icon={<Inbox size={18} />} label="Feedback Inbox" onClick={() => setActiveModal("feedback")} />
        <MenuButton icon={<Utensils size={18} />} label="Dish Requests" onClick={() => setActiveModal("requests")} />
        <MenuButton icon={<Users size={18} />} label="My Guests" onClick={() => setActiveModal("guests")} />
        <MenuButton icon={<ChefHat size={18} />} label="My Profile" onClick={() => setActiveModal("profile")} />
      </HamburgerMenu>

      <Modal id="feedback-modal" title="Feedback Inbox" isOpen={activeModal === "feedback"} onClose={() => setActiveModal(null)}>
        {feedbackNode}
      </Modal>

      <Modal id="requests-modal" title="Dish Requests" isOpen={activeModal === "requests"} onClose={() => setActiveModal(null)}>
        {dishRequestNode}
      </Modal>

      <Modal id="guests-modal" title="My Guests" isOpen={activeModal === "guests"} onClose={() => setActiveModal(null)}>
        {guestsNode}
      </Modal>

      <Modal id="profile-modal" title="Chef Profile" isOpen={activeModal === "profile"} onClose={() => setActiveModal(null)}>
        {profileNode}
      </Modal>
    </>
  );
}
