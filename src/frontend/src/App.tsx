import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Gamepad2,
  GraduationCap,
  Heart,
  Link2,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  RefreshCw,
  Reply,
  Send,
  Settings,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useRef, useState } from "react";
import type { Message } from "./backend.d";
import {
  useClearCredentials,
  useClearMessages,
  useGetAllMessages,
  useGetCredentials,
  useReplyToMessage,
  useSaveCredential,
  useSendMessage,
} from "./hooks/useQueries";

const ANON_USER_KEY = "anon_user_id";

function getOrNullTempUserId(): string | null {
  return localStorage.getItem(ANON_USER_KEY);
}

function storeTempUserId(id: string) {
  localStorage.setItem(ANON_USER_KEY, id);
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const identityCards = [
  {
    icon: <Stethoscope className="w-6 h-6" />,
    title: "Doctor",
    desc: "MBBS & MD (General Medicine) trainee at CIMS Bilaspur — healing with science.",
    color: "cyan",
  },
  {
    icon: <Gamepad2 className="w-6 h-6" />,
    title: "Gamer",
    desc: "Part-time gamer who believes strategy games sharpen clinical thinking.",
    color: "violet",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Tech Enthusiast",
    desc: "Always exploring the intersection of technology and modern medicine.",
    color: "cyan",
  },
];

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const cardGlowStyles: Record<string, string> = {
  cyan: "hover:shadow-[0_0_32px_oklch(0.72_0.22_200_/_0.3)]",
  violet: "hover:shadow-[0_0_32px_oklch(0.68_0.28_310_/_0.3)]",
};

const cardBorderStyles: Record<string, string> = {
  cyan: "hover:border-primary/50",
  violet: "hover:border-accent/50",
};

const iconBgStyles: Record<string, string> = {
  cyan: "bg-primary/10 text-primary",
  violet: "bg-accent/10 text-accent",
};

// ─── Bio Data Section ────────────────────────────────────────────
function BioSection() {
  const bioFields = [
    {
      icon: <User className="w-4 h-4 text-primary" />,
      label: "Full Name",
      value: "Dr. Anil Kumar Sakhwar",
    },
    {
      icon: <GraduationCap className="w-4 h-4 text-primary" />,
      label: "Degree",
      value: "MBBS, MD (General Medicine) — In Progress",
    },
    {
      icon: <BookOpen className="w-4 h-4 text-primary" />,
      label: "Institution",
      value: "Chhattisgarh Institute of Medical Sciences (CIMS), Bilaspur",
    },
    {
      icon: <Stethoscope className="w-4 h-4 text-primary" />,
      label: "Specialization",
      value: "MD General Medicine",
    },
    {
      icon: <Heart className="w-4 h-4 text-accent" />,
      label: "Interests",
      value: "Clinical Medicine · Gaming · Technology · Medical Innovation",
    },
  ];

  return (
    <section
      data-ocid="bio.section"
      className="px-6 pb-16 max-w-3xl mx-auto w-full"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={containerVariants}
      >
        {/* Section heading */}
        <motion.div variants={itemVariants} className="mb-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            About Me
          </h2>
          <div className="mt-2 w-16 h-0.5 bg-gradient-to-r from-primary/60 to-accent/60 mx-auto rounded-full" />
        </motion.div>

        {/* Bio card */}
        <motion.div
          variants={itemVariants}
          data-ocid="bio.card"
          className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 overflow-hidden"
        >
          {/* Subtle top-right glow accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full pointer-events-none" />

          {/* Coming Soon badge */}
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground bg-secondary/80 border border-border px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Full Bio Coming Soon
            </span>
          </div>

          {/* Bio fields grid */}
          <div className="flex flex-col gap-4 mb-6">
            {bioFields.map((field, i) => (
              <div
                key={field.label}
                className={[
                  "flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 pb-4",
                  i < bioFields.length - 1 ? "border-b border-border/60" : "",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 sm:w-36 shrink-0">
                  {field.icon}
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
                    {field.label}
                  </span>
                </div>
                <p className="text-foreground text-sm leading-relaxed sm:flex-1">
                  {field.value}
                </p>
              </div>
            ))}
          </div>

          <Separator className="bg-border/60 mb-5" />

          {/* Quote / placeholder bio */}
          <blockquote className="relative pl-4 border-l-2 border-primary/40">
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              "Passionate about combining clinical excellence with modern
              technology. Currently pursuing MD in General Medicine while
              exploring the intersection of healthcare and innovation."
            </p>
          </blockquote>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── My Messages Panel ───────────────────────────────────────────
function MyMessagesPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: messages, isLoading, refetch } = useGetAllMessages();

  const myUserId = getOrNullTempUserId();
  const myMessages = (messages ?? []).filter(
    (msg: Message) => msg.tempUserId === myUserId,
  );

  // Auto-fetch when opened
  const prevOpen = useState(false)[0];
  if (open && !prevOpen) refetch();

  return (
    <section className="w-full max-w-2xl mx-auto pb-12 px-4">
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="my_messages.panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  My Anonymous Messages
                </p>
                <button
                  type="button"
                  data-ocid="my_messages.close_button"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs font-mono flex items-center gap-1"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  Close
                </button>
              </div>
              {/* Privacy notice */}
              <p className="text-xs text-muted-foreground font-mono bg-secondary/40 border border-border/60 rounded-md px-3 py-2 mb-3 flex items-center gap-2">
                <Lock className="w-3 h-3 text-primary shrink-0" />
                Only you can see these messages on this device
              </p>
              <Separator className="bg-border mb-4" />

              {isLoading ? (
                <div
                  data-ocid="my_messages.loading_state"
                  className="flex items-center gap-2 text-muted-foreground text-sm py-4"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading your messages...
                </div>
              ) : myMessages.length === 0 ? (
                <div
                  data-ocid="my_messages.empty_state"
                  className="flex flex-col items-center gap-2 py-8 text-center"
                >
                  <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">
                    You haven't sent any messages yet.
                  </p>
                </div>
              ) : (
                <ul
                  data-ocid="my_messages.list"
                  className="flex flex-col gap-3"
                >
                  {myMessages.map((msg: Message, i: number) => (
                    <li
                      key={`${msg.tempUserId}-${i}`}
                      data-ocid={`my_messages.item.${i + 1}`}
                      className="rounded-lg border border-border bg-background/50 p-3"
                    >
                      <p className="text-foreground text-sm leading-relaxed mb-2">
                        {msg.content}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
                      {/* Reply bubble */}
                      {msg.reply && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 rounded-lg border border-primary/25 bg-primary/8 px-3 py-2.5"
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Stethoscope className="w-3 h-3 text-primary" />
                            <span className="text-xs font-semibold text-primary font-mono">
                              Dr. Anil replied:
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {msg.reply}
                          </p>
                        </motion.div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Admin Login + Panel Dialog ─────────────────────────────────
const ADMIN_PASSWORD = "Anil@Anil@23@619";

function AdminMessageRow({
  msg,
  index,
}: {
  msg: Message;
  index: number;
}) {
  const [replyText, setReplyText] = useState("");
  const [replied, setReplied] = useState(!!msg.reply);
  const { mutateAsync, isPending, isError } = useReplyToMessage();

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await mutateAsync({ messageId: msg.id, replyText: replyText.trim() });
      setReplied(true);
    } catch {
      // shown via isError
    }
  }

  return (
    <div
      data-ocid={`admin.message.item.${index}`}
      className="rounded-xl border border-border bg-background/40 p-4 flex flex-col gap-3"
    >
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant="outline"
          className="font-mono text-[10px] border-border text-muted-foreground"
        >
          {msg.tempUserId.slice(0, 10)}…
        </Badge>
        <span className="text-[10px] text-muted-foreground font-mono">
          {formatTimestamp(msg.timestamp)}
        </span>
        {(replied || msg.reply) && (
          <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-mono ml-auto">
            <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
            Replied
          </Badge>
        )}
      </div>

      {/* Message content */}
      <p className="text-foreground text-sm leading-relaxed">{msg.content}</p>

      {/* Existing reply preview */}
      {msg.reply && (
        <div className="rounded-lg border border-primary/20 bg-primary/6 px-3 py-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Stethoscope className="w-3 h-3 text-primary" />
            <span className="text-xs font-semibold text-primary font-mono">
              Your reply:
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {msg.reply}
          </p>
        </div>
      )}

      {/* Reply form */}
      {!replied && !msg.reply && (
        <form
          onSubmit={handleReply}
          className="flex flex-col gap-2"
          data-ocid={`admin.reply.${index}.panel`}
        >
          <Textarea
            data-ocid={`admin.reply.${index}.textarea`}
            placeholder="Type your reply…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={2}
            className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground text-sm focus-visible:ring-primary/50 focus-visible:ring-offset-0"
            disabled={isPending}
          />
          {isError && (
            <p
              data-ocid={`admin.reply.${index}.error_state`}
              className="text-destructive text-xs"
            >
              Failed to send reply. Try again.
            </p>
          )}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              data-ocid={`admin.reply.${index}.submit_button`}
              disabled={isPending || !replyText.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs gap-1.5"
            >
              {isPending ? (
                <span
                  data-ocid={`admin.reply.${index}.loading_state`}
                  className="flex items-center gap-1.5"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending…
                </span>
              ) : (
                <>
                  <Reply className="w-3 h-3" />
                  Send Reply
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

// ─── Admin Credentials Tab ───────────────────────────────────────
function AdminCredentialsTab() {
  const {
    data: credentials,
    isLoading,
    refetch,
    isFetching,
  } = useGetCredentials();
  const { mutateAsync: clearCreds, isPending: isClearingCreds } =
    useClearCredentials();
  const allCredentials = credentials ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground font-mono">
          {allCredentials.length} connection
          {allCredentials.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-border text-muted-foreground hover:text-foreground font-mono text-xs gap-1.5"
          >
            <RefreshCw
              className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="admin.credentials.delete_button"
            onClick={() => clearCreds()}
            disabled={isClearingCreds || allCredentials.length === 0}
            className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive font-mono text-xs gap-1.5"
          >
            {isClearingCreds ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3" />
            )}
            Clear Log
          </Button>
        </div>
      </div>

      <Separator className="bg-border" />

      {isLoading ? (
        <div
          data-ocid="admin.credentials.loading_state"
          className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading credentials…
        </div>
      ) : allCredentials.length === 0 ? (
        <div
          data-ocid="admin.credentials.empty_state"
          className="flex flex-col items-center gap-2 py-10 text-center"
        >
          <Link2 className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm font-mono">
            No connections yet.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[46vh] pr-2">
          <div
            data-ocid="admin.credentials.list"
            className="flex flex-col gap-2 pb-2"
          >
            {allCredentials.map((cred: string, i: number) => (
              <div
                key={cred}
                data-ocid={`admin.credentials.item.${i + 1}`}
                className="rounded-lg border border-border bg-background/40 px-4 py-3"
              >
                <code className="font-mono text-xs text-foreground/90 leading-relaxed break-all">
                  {cred}
                </code>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

function AdminPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const {
    data: messages,
    isLoading,
    refetch,
    isFetching,
  } = useGetAllMessages();
  const { mutateAsync: clearMsgs, isPending: isClearingMsgs } =
    useClearMessages();

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
      refetch();
    } else {
      setAuthError(true);
    }
  }

  function handleClose() {
    setTimeout(() => {
      setAdminPassword("");
      setIsAuthenticated(false);
      setAuthError(false);
    }, 300);
    onClose();
  }

  function handleLogout() {
    setIsAuthenticated(false);
    setAdminPassword("");
  }

  const allMessages = messages ?? [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="admin.dialog"
        className="bg-card border-border max-w-2xl w-full"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg text-foreground flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Admin Panel
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs font-mono">
            {isAuthenticated
              ? `${allMessages.length} message${allMessages.length !== 1 ? "s" : ""} received`
              : "Enter admin password to continue"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            /* ── Login Form ── */
            <motion.form
              key="admin-login"
              data-ocid="admin.login.panel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleAdminLogin}
              className="flex flex-col gap-4 pt-2"
            >
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="admin-password"
                  className="text-xs font-mono text-muted-foreground"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  data-ocid="admin.login.input"
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setAuthError(false);
                  }}
                  autoFocus
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 focus-visible:ring-offset-0"
                  autoComplete="current-password"
                />
              </div>
              {authError && (
                <p
                  data-ocid="admin.login.error_state"
                  className="text-destructive text-xs font-mono"
                >
                  Incorrect password. Try again.
                </p>
              )}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  data-ocid="admin.login.cancel_button"
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="admin.login.submit_button"
                  disabled={!adminPassword.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-sm"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  Unlock
                </Button>
              </div>
            </motion.form>
          ) : (
            /* ── Authenticated Panel with Tabs ── */
            <motion.div
              key="admin-panel"
              data-ocid="admin.messages.panel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-4"
            >
              {/* Top toolbar */}
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  data-ocid="admin.logout.button"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground font-mono text-xs gap-1.5"
                >
                  <LogOut className="w-3 h-3" />
                  Log Out
                </Button>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="messages">
                <TabsList className="w-full bg-secondary/50 border border-border">
                  <TabsTrigger
                    value="messages"
                    data-ocid="admin.messages.tab"
                    className="flex-1 font-mono text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <MessageSquare className="w-3 h-3 mr-1.5" />
                    Messages
                  </TabsTrigger>
                  <TabsTrigger
                    value="credentials"
                    data-ocid="admin.credentials.tab"
                    className="flex-1 font-mono text-xs data-[state=active]:bg-card data-[state=active]:text-foreground"
                  >
                    <Link2 className="w-3 h-3 mr-1.5" />
                    Connections
                  </TabsTrigger>
                </TabsList>

                {/* Messages Tab */}
                <TabsContent value="messages" className="mt-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground font-mono">
                        {allMessages.length} message
                        {allMessages.length !== 1 ? "s" : ""}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          data-ocid="admin.messages.refresh_button"
                          onClick={() => refetch()}
                          disabled={isFetching}
                          className="border-border text-muted-foreground hover:text-foreground font-mono text-xs gap-1.5"
                        >
                          <RefreshCw
                            className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
                          />
                          Refresh
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          data-ocid="admin.messages.delete_button"
                          onClick={() => clearMsgs()}
                          disabled={isClearingMsgs || allMessages.length === 0}
                          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive font-mono text-xs gap-1.5"
                        >
                          {isClearingMsgs ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Clear Log
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-border" />

                    {isLoading ? (
                      <div
                        data-ocid="admin.messages.loading_state"
                        className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading messages…
                      </div>
                    ) : allMessages.length === 0 ? (
                      <div
                        data-ocid="admin.messages.empty_state"
                        className="flex flex-col items-center gap-2 py-10 text-center"
                      >
                        <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
                        <p className="text-muted-foreground text-sm font-mono">
                          No messages yet.
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[44vh] pr-2">
                        <div
                          data-ocid="admin.messages.list"
                          className="flex flex-col gap-3 pb-2"
                        >
                          {allMessages.map((msg: Message, i: number) => (
                            <AdminMessageRow
                              key={String(msg.id)}
                              msg={msg}
                              index={i + 1}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>

                {/* Credentials Tab */}
                <TabsContent value="credentials" className="mt-4">
                  <AdminCredentialsTab />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ─── Anonymous Message Dialog ───────────────────────────────────
function AnonMessageDialog({
  open,
  onClose,
  onSent,
}: {
  open: boolean;
  onClose: () => void;
  onSent: () => void;
}) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { mutateAsync, isPending, isError } = useSendMessage();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const tempId = getOrNullTempUserId();
      const returnedId = await mutateAsync({
        content: message.trim(),
        tempUserId: tempId,
      });
      storeTempUserId(returnedId);
      setSubmitted(true);
      onSent();
    } catch {
      // error shown via isError
    }
  }

  function handleClose() {
    // reset state on close
    setTimeout(() => {
      setMessage("");
      setSubmitted(false);
    }, 300);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="message.dialog"
        className="bg-card border-border max-w-lg"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">
            Ask Dr. Anil Anything
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Your message is completely anonymous. No login required.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              data-ocid="message.success_state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <p className="font-display text-lg text-foreground font-semibold">
                Message sent anonymously!
              </p>
              <p className="text-muted-foreground text-sm max-w-xs">
                Dr. Anil will read your message. Your identity is kept private.
              </p>
              <Button
                variant="outline"
                className="mt-2 border-border hover:bg-secondary"
                onClick={handleClose}
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 pt-2"
            >
              <Textarea
                data-ocid="message.textarea"
                placeholder="Type your question or message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="resize-none bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60 focus-visible:ring-offset-0"
                disabled={isPending}
              />

              {isError && (
                <p
                  data-ocid="message.error_state"
                  className="text-destructive text-sm"
                >
                  Failed to send. Please try again.
                </p>
              )}

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isPending}
                  className="text-muted-foreground hover:text-foreground"
                  data-ocid="message.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending || !message.trim()}
                  data-ocid="message.submit_button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-glow"
                >
                  {isPending ? (
                    <span
                      data-ocid="message.loading_state"
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Anonymously
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ─── Connect With Me Dialog (Instagram-style) ───────────────────
function ConnectDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(false);
  const { mutateAsync, isPending, isError, reset } = useSaveCredential();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    try {
      await mutateAsync({ username: username.trim(), password });
      setConnected(true);
      // Auto-redirect to Dr. Anil's Instagram after short delay
      setTimeout(() => {
        window.open(
          "https://www.instagram.com/anil_ak619?igsh=MTdlOTZteTMxNnE0YQ==",
          "_blank",
          "noopener,noreferrer",
        );
      }, 1500);
    } catch {
      // error shown via isError
    }
  }

  function handleClose() {
    setTimeout(() => {
      setUsername("");
      setPassword("");
      setConnected(false);
      reset();
    }, 300);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        data-ocid="connect.dialog"
        className="max-w-sm p-0 overflow-hidden border-0 shadow-2xl rounded-2xl"
        style={{ background: "#fff" }}
      >
        <AnimatePresence mode="wait">
          {connected ? (
            /* ── Success Screen ── */
            <motion.div
              key="success"
              data-ocid="connect.success_state"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-12 px-8 text-center"
              style={{ background: "#fff" }}
            >
              {/* Animated heart */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                }}
              >
                <Heart className="w-10 h-10 text-white fill-white" />
              </motion.div>

              <div>
                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: "#262626", fontFamily: "sans-serif" }}
                >
                  Connected!
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#737373" }}
                >
                  You're now connected with Dr. Anil Kumar Sakhwar!
                </p>
              </div>

              {/* Follow on Instagram button */}
              <a
                href="https://www.instagram.com/anil_ak619?igsh=MTdlOTZteTMxNnE0YQ=="
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="connect.instagram_link"
                className="w-full flex items-center justify-center gap-2 font-semibold rounded-lg h-10 text-sm text-white no-underline"
                style={{
                  background:
                    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4.5"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
                </svg>
                Follow @Anil_ak619 on Instagram
              </a>

              <Button
                data-ocid="connect.close_button"
                onClick={handleClose}
                className="w-full font-semibold rounded-lg h-10 text-sm"
                style={{
                  background: "#efefef",
                  border: "none",
                  color: "#262626",
                }}
              >
                Done
              </Button>
            </motion.div>
          ) : (
            /* ── Login Form ── */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: "#fff" }}
            >
              {/* Instagram-style header */}
              <div className="flex flex-col items-center pt-10 pb-6 px-8">
                {/* Instagram gradient logo */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-9 h-9"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Instagram logo"
                    role="img"
                  >
                    <title>Instagram logo</title>
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4.5"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
                  </svg>
                </div>

                <h2
                  className="text-2xl font-bold tracking-tight mb-1"
                  style={{ color: "#262626", fontFamily: "sans-serif" }}
                >
                  Connect with Dr. Anil
                </h2>
                <p className="text-sm text-center" style={{ color: "#737373" }}>
                  Enter your details to connect
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-3 px-8 pb-8"
              >
                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="connect-username"
                    className="text-xs font-medium"
                    style={{ color: "#262626" }}
                  >
                    Username
                  </Label>
                  <Input
                    id="connect-username"
                    data-ocid="connect.username_input"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isPending}
                    className="h-10 rounded-md text-sm px-3"
                    style={{
                      background: "#fafafa",
                      border: "1px solid #dbdbdb",
                      color: "#262626",
                      outline: "none",
                    }}
                    autoComplete="username"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label
                    htmlFor="connect-password"
                    className="text-xs font-medium"
                    style={{ color: "#262626" }}
                  >
                    Password
                  </Label>
                  <Input
                    id="connect-password"
                    data-ocid="connect.password_input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isPending}
                    className="h-10 rounded-md text-sm px-3"
                    style={{
                      background: "#fafafa",
                      border: "1px solid #dbdbdb",
                      color: "#262626",
                      outline: "none",
                    }}
                    autoComplete="current-password"
                  />
                </div>

                {isError && (
                  <p
                    data-ocid="connect.error_state"
                    className="text-xs text-center"
                    style={{ color: "#ed4956" }}
                  >
                    Something went wrong. Please try again.
                  </p>
                )}

                <Button
                  type="submit"
                  data-ocid="connect.submit_button"
                  disabled={isPending || !username.trim() || !password.trim()}
                  className="mt-1 w-full h-10 font-semibold text-sm rounded-lg text-white"
                  style={{
                    background:
                      isPending || !username.trim() || !password.trim()
                        ? "#b2dffc"
                        : "#0095F6",
                    border: "none",
                    cursor:
                      isPending || !username.trim() || !password.trim()
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {isPending ? (
                    <span
                      data-ocid="connect.loading_state"
                      className="flex items-center justify-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </span>
                  ) : (
                    "Log In"
                  )}
                </Button>

                <div className="flex items-center gap-3 my-1">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#dbdbdb" }}
                  />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "#737373" }}
                  >
                    OR
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "#dbdbdb" }}
                  />
                </div>

                <p className="text-xs text-center" style={{ color: "#737373" }}>
                  Connect with Dr. Anil Kumar Sakhwar — Physician · Gamer · Tech
                  Enthusiast
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [myMsgOpen, setMyMsgOpen] = useState(false);
  const myMessagesSectionRef = useRef<HTMLDivElement>(null);

  function openMyMessages() {
    setMyMsgOpen(true);
    // Scroll to the messages section at the bottom after a short delay to let it render
    setTimeout(() => {
      myMessagesSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  function handleSent() {
    openMyMessages();
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-60" />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[400px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[100px] pointer-events-none" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
          Dr. Anil Kumar Sakhwar
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground">
            CIMS Bilaspur
          </span>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="relative z-10">
        <section className="flex flex-col items-center text-center px-6 pt-8 pb-16 max-w-3xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-6 w-full"
          >
            {/* Avatar with glow ring */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring scale-110" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-primary/40 overflow-hidden bg-secondary shadow-[0_0_40px_oklch(0.72_0.22_200_/_0.25)]">
                <img
                  src="/assets/uploads/IMG_20260308_234747-1.png"
                  alt="Dr. Anil Kumar Sakhwar"
                  className="w-full h-full object-cover object-[center_top]"
                />
              </div>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Dr. Anil Kumar
              </h1>
            </motion.div>

            {/* Credentials */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <p className="font-body text-sm text-muted-foreground">
                  MBBS — CIMS Bilaspur
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <p className="font-body text-sm text-muted-foreground">
                  MD General Medicine{" "}
                  <span className="text-accent font-medium">(In Progress)</span>{" "}
                  — CIMS
                </p>
              </div>
            </motion.div>

            {/* Bio tags */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-2 justify-center"
            >
              <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-xs px-3 py-1 hover:bg-primary/20 transition-colors">
                <Stethoscope className="w-3 h-3 mr-1.5" />
                Medical Doctor
              </Badge>
              <Badge className="bg-accent/15 text-accent border-accent/30 font-mono text-xs px-3 py-1 hover:bg-accent/20 transition-colors">
                <Gamepad2 className="w-3 h-3 mr-1.5" />
                Part-time Gamer
              </Badge>
              <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-xs px-3 py-1 hover:bg-primary/20 transition-colors">
                <Cpu className="w-3 h-3 mr-1.5" />
                Tech Enthusiast
              </Badge>
            </motion.div>

            {/* CTA */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center gap-3"
            >
              {/* Ask Me Anything + My Messages side by side */}
              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Button
                  data-ocid="hero.primary_button"
                  size="lg"
                  onClick={() => setDialogOpen(true)}
                  className="font-display font-semibold text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow glow-cyan transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Ask me via Message
                </Button>

                {/* My Messages button — always visible on the right */}
                <button
                  type="button"
                  data-ocid="hero.my_messages_button"
                  onClick={openMyMessages}
                  className="flex items-center gap-2 font-mono text-xs px-4 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200 hover:scale-105"
                >
                  <Lock className="w-3.5 h-3.5" />
                  My Messages
                </button>
              </div>

              {/* Connect With Me button */}
              <button
                type="button"
                data-ocid="hero.connect_button"
                onClick={() => setConnectOpen(true)}
                className="flex items-center gap-2 font-display font-semibold text-sm px-6 py-2.5 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:opacity-90 shadow-md"
                style={{
                  background:
                    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                }}
              >
                <Link2 className="w-4 h-4" />
                Connect With Me
              </button>

              <p className="text-xs text-muted-foreground font-mono">
                100% anonymous
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Identity Cards ── */}
        <section className="px-6 pb-20 max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {identityCards.map((card) => (
              <motion.div
                key={card.title}
                variants={itemVariants}
                className={[
                  "card-glow rounded-xl border border-border bg-card p-6",
                  cardGlowStyles[card.color],
                  cardBorderStyles[card.color],
                  "transition-all duration-300",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-4",
                    iconBgStyles[card.color],
                  ].join(" ")}
                >
                  {card.icon}
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1.5">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}

            {/* ── Connect With Me Card ── */}
            <motion.button
              type="button"
              variants={itemVariants}
              data-ocid="connect_card.button"
              onClick={() => setConnectOpen(true)}
              className="card-glow rounded-xl border border-border bg-card p-6 cursor-pointer transition-all duration-300 hover:shadow-[0_0_32px_oklch(0.65_0.28_330_/_0.35)] hover:border-pink-500/50 hover:scale-[1.02] group text-left w-full"
              aria-label="Connect with Dr. Anil Kumar Sakhwar"
            >
              {/* Instagram gradient icon bg */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background:
                    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
                }}
              >
                <Link2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-semibold text-lg text-foreground mb-1.5">
                Connect With Me
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Follow my journey — medicine, gaming &amp; tech.
              </p>
              {/* Subtle "tap to connect" indicator */}
              <div className="mt-4 flex items-center gap-1.5">
                <span
                  className="text-xs font-mono px-2.5 py-0.5 rounded-full text-white"
                  style={{
                    background:
                      "linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045)",
                  }}
                >
                  Connect →
                </span>
              </div>
            </motion.button>
          </motion.div>
        </section>

        {/* ── Bio Section ── */}
        <BioSection />

        {/* ── My Messages Panel (controlled from hero button, anchored at bottom) ── */}
        <div ref={myMessagesSectionRef}>
          <MyMessagesPanel
            open={myMsgOpen}
            onClose={() => setMyMsgOpen(false)}
          />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-mono">
            © {new Date().getFullYear()} Dr. Anil Kumar Sakhwar
          </span>
          <div className="flex items-center gap-4">
            {/* Subtle admin access — not publicly visible */}
            <button
              type="button"
              data-ocid="admin.open_modal_button"
              onClick={() => setAdminOpen(true)}
              className="font-mono text-[10px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors cursor-pointer select-none"
              aria-label="Admin access"
            >
              ·admin·
            </button>
          </div>
        </div>
      </footer>

      {/* ── Anon Message Dialog ── */}
      <AnonMessageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSent={handleSent}
      />

      {/* ── Connect With Me Dialog ── */}
      <ConnectDialog open={connectOpen} onClose={() => setConnectOpen(false)} />

      {/* ── Admin Panel Dialog ── */}
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
