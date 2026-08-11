"use client";

import { useState, ReactNode } from "react";
import { HamburgerMenu, MenuButton } from "./HamburgerMenu";
import { Modal } from "./Modal";
import { Inbox, Utensils, ChefHat } from "lucide-react";

interface ChefMenuProps {
  feedbackNode: ReactNode;
  dishRequestNode: ReactNode;
  profileNode: ReactNode;
}

export function ChefMenu({ feedbackNode, dishRequestNode, profileNode }: ChefMenuProps) {
  const [activeModal, setActiveModal] = useState<"feedback" | "requests" | "profile" | null>(null);

  return (
    <>
      <HamburgerMenu>
        <MenuButton icon={<Inbox size={18} />} label="Feedback Inbox" onClick={() => setActiveModal("feedback")} />
        <MenuButton icon={<Utensils size={18} />} label="Dish Requests" onClick={() => setActiveModal("requests")} />
        <MenuButton icon={<ChefHat size={18} />} label="My Profile" onClick={() => setActiveModal("profile")} />
      </HamburgerMenu>

      <Modal id="feedback-modal" title="Feedback Inbox" isOpen={activeModal === "feedback"} onClose={() => setActiveModal(null)}>
        {feedbackNode}
      </Modal>

      <Modal id="requests-modal" title="Dish Requests" isOpen={activeModal === "requests"} onClose={() => setActiveModal(null)}>
        {dishRequestNode}
      </Modal>

      <Modal id="profile-modal" title="Chef Profile" isOpen={activeModal === "profile"} onClose={() => setActiveModal(null)}>
        {profileNode}
      </Modal>
    </>
  );
}
