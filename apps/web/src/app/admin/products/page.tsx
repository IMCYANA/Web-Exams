'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Plus, Search, Filter, Pencil, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';

import { GameFormModal } from '@/components/admin/GameFormModal';

export default function ProductsPage() {
    const [games, setGames] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchGames = async () => {
        try {
            const { data } = await api.get('/games');
            setGames(data);
        } catch (error) {
            console.error("Failed to fetch games", error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <div className="space-y-6">
            <GameFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchGames}
            />
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">รายการเกมทั้งหมด</h1>
                    <p className="text-sm text-muted-foreground">จัดการสินค้า สต็อก และสถานะการขาย</p>
                </div>
                <Button
                    className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setIsModalOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    เพิ่มเกมใหม่
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="ค้นหาชื่อเกม..." className="pl-10 bg-black/20 border-white/10" />
                </div>
                <Button variant="outline" className="gap-2 border-white/10 bg-black/20">
                    <Filter className="h-4 w-4" />
                    ทุกหมวดหมู่
                </Button>
            </div>

            <Card className="bg-[#18181b] border-white/5">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead>ชื่อเกม / ข้อมูล</TableHead>
                                <TableHead className="text-center">ยอดขาย</TableHead>
                                <TableHead className="text-center">ไอดีที่เหลือ</TableHead>
                                <TableHead>วันที่สร้าง</TableHead>
                                <TableHead>ผู้สร้าง</TableHead>
                                <TableHead>สถานะ</TableHead>
                                <TableHead className="text-right">จัดการ</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {games.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-48 text-muted-foreground">
                                        ไม่มีสินค้าในระบบ
                                    </TableCell>
                                </TableRow>
                            ) : (
                                games.map((game) => (
                                    <TableRow key={game.id} className="border-white/5 hover:bg-white/5">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-white/10 overflow-hidden">
                                                    {game.image ? (
                                                        <img src={game.image} alt={game.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs">IMG</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{game.title}</p>
                                                    <p className="text-xs text-muted-foreground">{game.genre || 'General'}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center font-bold">0</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${game.keys?.length > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                                {game.keys?.length || 0}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(game.createdAt || Date.now()).toLocaleDateString('th-TH')}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">admin@admin.com</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-500">
                                                เผยแพร่
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-500 hover:bg-blue-500/10">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500 hover:bg-red-500/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
