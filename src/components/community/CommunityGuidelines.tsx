"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { COMMUNITY_GUIDELINES } from "@/lib/constants/posts";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Phone, MessageSquare, Building2 } from "lucide-react";

interface CommunityGuidelinesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommunityGuidelines({ isOpen, onClose }: CommunityGuidelinesProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[2rem] bg-white dark:bg-slate-900 shadow-2xl",
        header: "border-none px-8 pt-8 pb-0",
        body: "px-8 py-6",
        footer: "border-none px-8 pb-8 pt-0",
        closeButton: "top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {COMMUNITY_GUIDELINES.title}
          </h2>
          <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
            {COMMUNITY_GUIDELINES.intro}
          </p>
        </ModalHeader>
        <ModalBody className="pt-8">
          <div className="flex flex-col gap-8">
            {/* Crisis Resources - Moved to top and highlighted */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm dark:border-blue-900/50 dark:bg-blue-950/30">
              <h3 className="mb-2 text-base font-bold text-blue-900 dark:text-blue-100">
                Crisis Support Resources
              </h3>
              <p className="mb-4 text-xs text-blue-800 dark:text-blue-200">
                {COMMUNITY_GUIDELINES.crisisResources.intro}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {COMMUNITY_GUIDELINES.crisisResources.resources.map((resource, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1.5 rounded-xl border border-blue-200 bg-white p-3 shadow-sm dark:border-blue-900 dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      {index === 0 && <MessageSquare className="h-3.5 w-3.5" />}
                      {index === 1 && <Phone className="h-3.5 w-3.5" />}
                      {index === 2 && <Building2 className="h-3.5 w-3.5" />}
                      <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">
                        {resource.name}
                      </h4>
                    </div>
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                      {resource.contact}
                    </p>
                    <p className="text-[10px] leading-relaxed text-blue-700 dark:text-blue-300">
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Values */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                Our Values
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {COMMUNITY_GUIDELINES.values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
                  >
                    <h4 className="mb-2 font-semibold text-slate-900 dark:text-white">
                      {value.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {value.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              {/* Supportive Behaviors */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Supportive Behaviors
                  </h3>
                </div>
                <ul className="space-y-3">
                  {COMMUNITY_GUIDELINES.supportiveBehaviors.map((behavior, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                      <span className="leading-relaxed">{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unsupportive Behaviors */}
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="rounded-full bg-red-100 p-1 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    What to Avoid
                  </h3>
                </div>
                <ul className="space-y-3">
                  {COMMUNITY_GUIDELINES.unsupportiveBehaviors.map((behavior, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                    >
                      <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600 dark:text-red-400" />
                      <span className="leading-relaxed">{behavior}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onPress={onClose}
            className="rounded-full bg-slate-900 px-8 font-medium text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-white/10 dark:hover:bg-slate-100"
          >
            Got it
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
