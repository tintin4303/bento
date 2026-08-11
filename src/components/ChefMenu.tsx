"use client";

import { useState, ReactNode } from "react";
import { HamburgerMenu, MenuButton } from "./HamburgerMenu";
import { Modal } from "./Modal";

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
        <MenuButton icon="💌" label="Feedback Inbox" onClick={() => setActiveModal("feedback")} />
        <MenuButton icon="✨" label="Dish Requests" onClick={() => setActiveModal("requests")} />
        <MenuButton icon="👨‍🍳" label="My Profile" onClick={() => setActiveModal("profile")} />
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
