'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Info, Loader2 } from 'lucide-react';

interface GameOption {
    id: string;
    name: string;
    price: number;
    image?: string;
}

interface Game {
    id: string;
    title: string;
    slug: string;
    category: string;
    imageUrl?: string;
    price: number;
    options: GameOption[];
}

export function ProductGrid() {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState<string[]>(['All']);

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const { data } = await api.get('/games');
            setGames(data);

            const cats = Array.from(new Set(data.map((g: Game) => g.category))).filter(Boolean) as string[];
            setCategories(['All', ...cats]);
        } catch (error) {
            console.error('Failed to fetch games', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <section className="container mx-auto py-16 px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Game Services</h2>
                    <p className="text-muted-foreground mt-2">Explore our premium game accounts and keys.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                        <Input
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border-white/10 pl-10 focus-visible:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <Tabs defaultValue="All" value={selectedCategory} onValueChange={setSelectedCategory} className="mb-10">
                <TabsList className="bg-white/5 border border-white/10 p-1">
                    {categories.map((cat) => (
                        <TabsTrigger key={cat} value={cat} className="data-[state=active]:bg-primary data-[state=active]:text-white">
                            {cat}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredGames.map((game) => (
                        <Card key={game.id} className="group overflow-hidden bg-[#18181b] border-white/10 hover:border-primary/50 transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.1)] hover:-translate-y-1">
                            <div className="relative aspect-[16/9] bg-muted/20 overflow-hidden">
                                {game.imageUrl ? (
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white border border-white/10">
                                    {game.category}
                                </div>
                            </div>

                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="truncate text-lg">{game.title}</CardTitle>
                            </CardHeader>

                            <CardContent className="p-4 pt-0">
                                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                                    <span>{game.options?.length || 0} Options</span>
                                    {game.options && game.options.length > 0 && (
                                        <span className="text-primary font-bold">
                                            Start {Math.min(...game.options.map(o => Number(o.price)))} ฿
                                        </span>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full bg-white/5 hover:bg-primary hover:text-white border border-white/10 transition-colors">
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <Info className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No games found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                </div>
            )}
        </section>
    );
}
