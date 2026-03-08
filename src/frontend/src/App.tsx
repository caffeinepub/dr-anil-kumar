import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  Gamepad2,
  Loader2,
  MessageSquare,
  Send,
  Stethoscope,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useState } from "react";
import type { Message } from "./backend.d";
import { useGetAllMessages, useSendMessage } from "./hooks/useQueries";

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

// ─── Anonymous Message Dialog ───────────────────────────────────
function AnonMessageDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
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

// ─── Admin Messages Panel ───────────────────────────────────────
function AdminPanel() {
  const [expanded, setExpanded] = useState(false);
  const { data: messages, isLoading, refetch } = useGetAllMessages();

  function handleToggle() {
    const next = !expanded;
    setExpanded(next);
    if (next) refetch();
  }

  return (
    <section className="w-full max-w-2xl mx-auto pb-12 px-4">
      <div className="flex justify-center">
        <button
          type="button"
          data-ocid="admin.toggle"
          onClick={handleToggle}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs font-mono transition-colors py-2 px-4 rounded-md hover:bg-secondary/50"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          {expanded ? "Hide Messages" : "View Messages"}
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <p className="font-display text-sm font-semibold text-foreground mb-3">
                Anonymous Messages
              </p>
              <Separator className="bg-border mb-4" />

              {isLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading messages...
                </div>
              ) : !messages || messages.length === 0 ? (
                <div
                  data-ocid="admin.empty_state"
                  className="flex flex-col items-center gap-2 py-8 text-center"
                >
                  <MessageSquare className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-muted-foreground text-sm">
                    No messages yet. Be the first to ask!
                  </p>
                </div>
              ) : (
                <ul data-ocid="admin.list" className="flex flex-col gap-3">
                  {messages.map((msg: Message, i: number) => (
                    <li
                      key={`${msg.tempUserId}-${i}`}
                      data-ocid={`admin.item.${i + 1}`}
                      className="rounded-lg border border-border bg-background/50 p-3"
                    >
                      <p className="text-foreground text-sm leading-relaxed mb-2">
                        {msg.content}
                      </p>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-mono text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded">
                          {msg.tempUserId.slice(0, 12)}…
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(msg.timestamp)}
                        </span>
                      </div>
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

// ─── Main App ───────────────────────────────────────────────────
export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);

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
          Dr. Anil Kumar
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
                  src="/assets/generated/dr-anil-avatar-transparent.dim_300x300.png"
                  alt="Dr. Anil Kumar"
                  className="w-full h-full object-cover"
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
            <motion.div variants={itemVariants}>
              <Button
                data-ocid="hero.primary_button"
                size="lg"
                onClick={() => setDialogOpen(true)}
                className="font-display font-semibold text-base px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow glow-cyan transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Ask Me Anything
              </Button>
              <p className="mt-2 text-xs text-muted-foreground font-mono">
                100% anonymous · no login required
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
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
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
          </motion.div>
        </section>

        {/* ── Admin Panel ── */}
        <AdminPanel />
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-border py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-mono">
            © {new Date().getFullYear()} Dr. Anil Kumar
          </span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors font-mono"
          >
            Built with ♥ using caffeine.ai
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>

      {/* ── Dialog ── */}
      <AnonMessageDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
