"use client";

import { useState, ReactNode } from "react";
import { HamburgerMenu, MenuButton } from "./HamburgerMenu";
import { Modal } from "./Modal";
import { History, Utensils, User, ChefHat } from "lucide-react";

interface GuestMenuProps {
  historyNode: ReactNode;
  dishRequestNode: ReactNode;
  profileNode: ReactNode;
  chefNode: ReactNode;
}

export function GuestMenu({ historyNode, dishRequestNode, profileNode, chefNode }: GuestMenuProps) {
  const [activeModal, setActiveModal] = useState<"history" | "request" | "profile" | "chef" | null>(null);

  return (
    <>
      <HamburgerMenu>
        <MenuButton icon={<History size={18} />} label="Order History" onClick={() => setActiveModal("history")} />
        <MenuButton icon={<Utensils size={18} />} label="Request a Dish" onClick={() => setActiveModal("request")} />
        <MenuButton icon={<ChefHat size={18} />} label="My Chef" onClick={() => setActiveModal("chef")} />
        <MenuButton icon={<User size={18} />} label="My Profile" onClick={() => setActiveModal("profile")} />
      </HamburgerMenu>

      <Modal id="history-modal" title="Order History" isOpen={activeModal === "history"} onClose={() => setActiveModal(null)}>
        {historyNode}
      </Modal>

      <Modal id="request-modal" title="Craving Something Else?" isOpen={activeModal === "request"} onClose={() => setActiveModal(null)}>
        {dishRequestNode}
      </Modal>

      <Modal id="chef-modal" title="My Chef" isOpen={activeModal === "chef"} onClose={() => setActiveModal(null)}>
        {chefNode}
      </Modal>

      <Modal id="profile-modal" title="My Profile" isOpen={activeModal === "profile"} onClose={() => setActiveModal(null)}>
        {profileNode}
      </Modal>
    </>
  );
}
