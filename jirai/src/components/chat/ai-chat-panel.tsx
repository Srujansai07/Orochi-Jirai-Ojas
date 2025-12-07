// Jirai - AI Chat Panel
// Sidebar panel for AI conversations

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, useWorkspaceStore } from '@/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types';
import {
    Send,
    Sparkles,
    Bot,
    User,
    Loader2,
    Plus,
    Copy,
    Check,
    Wand2,
} from 'lucide-react';

export function AIChatPanel() {
    const { messages, isLoading, addMessage, setLoading, startNewConversation } = useChatStore();
    const { nodes, setNodes } = useWorkspaceStore();
    const [input, setInput] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        addMessage(userMessage);
        setInput('');
        setLoading(true);

        // Simulate AI response (replace with actual API call later)
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: generateAIResponse(userMessage.content),
                timestamp: new Date(),
            };
            addMessage(aiResponse);
            setLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Quick prompts for common actions
    const quickPrompts = [
        { label: 'Mind Map', prompt: 'Create a mind map about' },
        { label: 'Study Plan', prompt: 'Generate a study plan for' },
        { label: 'Task List', prompt: 'Create a task list for' },
        { label: 'Breakdown', prompt: 'Break down this topic:' },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-white text-sm">AI Assistant</p>
                        <p className="text-xs text-slate-500">Generate nodes & ideas</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={startNewConversation}
                    className="text-slate-400 hover:text-white"
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>

            {/* Messages area */}
            <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                            <Bot className="w-8 h-8 text-violet-400" />
                        </div>
                        <h3 className="font-medium text-white mb-1">Start a conversation</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Ask me to create mind maps, study plans, or break down topics
                        </p>

                        {/* Quick prompts */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {quickPrompts.map((qp) => (
                                <Button
                                    key={qp.label}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setInput(qp.prompt + ' ')}
                                    className="text-xs border-slate-700 text-slate-300 hover:border-violet-500 hover:text-violet-300"
                                >
                                    <Wand2 className="w-3 h-3 mr-1" />
                                    {qp.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                                        }`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'user'
                                            ? 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                                            : 'bg-gradient-to-br from-violet-500 to-purple-600'
                                        }`}>
                                        {message.role === 'user' ? (
                                            <User className="w-4 h-4 text-white" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-white" />
                                        )}
                                    </div>

                                    {/* Message bubble */}
                                    <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''
                                        }`}>
                                        <div className={`inline-block rounded-lg p-3 text-sm ${message.role === 'user'
                                                ? 'bg-violet-600 text-white'
                                                : 'bg-slate-800 text-slate-200'
                                            }`}>
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>

                                        {/* Actions for AI messages */}
                                        {message.role === 'assistant' && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <button
                                                    onClick={() => copyToClipboard(message.content, message.id)}
                                                    className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                                                >
                                                    {copiedId === message.id ? (
                                                        <><Check className="w-3 h-3" /> Copied</>
                                                    ) : (
                                                        <><Copy className="w-3 h-3" /> Copy</>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Loading indicator */}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                    <span className="text-sm text-slate-400">Thinking...</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </ScrollArea>

            {/* Input area */}
            <div className="p-3 border-t border-slate-800">
                <div className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask AI to create nodes..."
                        rows={1}
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none min-h-[40px] max-h-[120px]"
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                        }}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
                <p className="text-xs text-slate-600 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

// Simple mock AI response generator
function generateAIResponse(userInput: string): string {
    const input = userInput.toLowerCase();

    if (input.includes('mind map') || input.includes('mindmap')) {
        return `I'd be happy to help you create a mind map! Here's a structure I suggest:

📍 **Central Topic**: [Your main topic]

**Main Branches:**
• Branch 1: Key concept
• Branch 2: Important aspect
• Branch 3: Related idea
• Branch 4: Supporting detail

Would you like me to generate nodes for a specific topic? Just tell me what you'd like to explore!`;
    }

    if (input.includes('study') || input.includes('learn')) {
        return `Here's a study plan structure:

📚 **Study Plan**

**Week 1-2: Foundation**
• Understand core concepts
• Review basic materials
• Take initial notes

**Week 3-4: Deep Dive**
• Explore advanced topics
• Practice with examples
• Create summary nodes

**Week 5+: Mastery**
• Apply knowledge
• Review and revise
• Connect related concepts

What subject would you like to create a study plan for?`;
    }

    if (input.includes('task') || input.includes('todo')) {
        return `I can help you create tasks! Here's a template:

✅ **Task List**

**High Priority:**
• [ ] Important task 1
• [ ] Critical deadline task

**Medium Priority:**
• [ ] Regular task
• [ ] Follow-up item

**Low Priority:**
• [ ] Nice to have
• [ ] Future consideration

What tasks would you like me to help you organize?`;
    }

    return `I understand you want to work on: "${userInput}"

I can help you:
• 🗺️ Create a mind map with connected nodes
• 📋 Break it down into tasks
• 📚 Generate a study/learning plan
• 🔗 Find related concepts

Just let me know how you'd like to proceed, and I'll generate the appropriate nodes for your canvas!`;
}

export default AIChatPanel;
