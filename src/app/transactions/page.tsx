
"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, increment, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

interface Transaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'buy' | 'sell';
    symbol?: string;
    shares?: number;
    price?: number;
    total: number;
    date: Date;
}

function TransactionHistory() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const q = query(collection(db, `users/${user.uid}/transactions`), orderBy('date', 'desc'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const newTransactions: Transaction[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    newTransactions.push({
                        id: doc.id,
                        ...data,
                        date: data.date?.toDate()
                    } as Transaction);
                });
                setTransactions(newTransactions);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>A record of all your account activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center">Loading history...</TableCell></TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow><TableCell colSpan={4} className="text-center">No transactions yet.</TableCell></TableRow>
                            ) : (
                                transactions.map(t => (
                                    <TableRow key={t.id}>
                                        <TableCell>{t.date ? format(t.date, 'PPpp') : 'Processing...'}</TableCell>
                                        <TableCell className="capitalize">{t.type}</TableCell>
                                        <TableCell>
                                            {t.symbol ? `${t.shares} shares of ${t.symbol} @ $${t.price?.toFixed(2)}` : 'Account Balance'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {t.type === 'buy' || t.type === 'withdraw' ? '-' : '+'}
                                            {t.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

export default function TransactionsPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDeposit = async () => {
        if (!user) return;
        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            toast({ variant: "destructive", title: "Invalid amount" });
            return;
        }

        setLoading(true);
        const userDocRef = doc(db, 'users', user.uid);
        const transactionColRef = collection(db, `users/${user.uid}/transactions`);

        try {
            await setDoc(userDocRef, {
                cashBalance: increment(depositAmount)
            }, { merge: true }); // Use setDoc with merge to create or update
            
            await addDoc(transactionColRef, {
                type: 'deposit',
                total: depositAmount,
                date: serverTimestamp()
            });
            toast({ title: "Deposit Successful", description: `Added ${depositAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} to your account.`});
            setAmount('');
        } catch (error) {
            console.error("Error depositing funds:", error);
            toast({ variant: "destructive", title: "Deposit Failed", description: "Something went wrong." });
        } finally {
            setLoading(false);
        }
    };

    return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Funds</CardTitle>
                    <CardDescription>
                        Deposit virtual money into your account to start trading.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input 
                            id="amount" 
                            type="number"
                            placeholder="e.g., 10000"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleDeposit} disabled={loading} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Deposit Funds
                    </Button>
                </CardFooter>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <TransactionHistory />
        </div>
      </div>
    </DashboardLayout>
  );
}
