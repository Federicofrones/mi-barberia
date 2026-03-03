"use client";

import { useEffect, useState } from 'react';
import { Card, Input, Button } from '@/components/ui';
import { Camera, Image as ImageIcon, Save, Plus, Trash2, Globe } from 'lucide-react';

export default function BrandingPage() {
    const [branding, setBranding] = useState<{ logoUrl: string, gallery: string[] }>({
        logoUrl: '',
        gallery: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetch('/api/admin/branding')
            .then(res => res.json())
            .then(data => {
                setBranding(data);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/branding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(branding)
            });
            if (res.ok) {
                alert('✅ Estilo de marca actualizado con éxito');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const addGalleryItem = () => {
        if (branding.gallery.length < 10) {
            setBranding({ ...branding, gallery: [...branding.gallery, ''] });
        }
    };

    const updateGalleryItem = (index: number, value: string) => {
        const newGallery = [...branding.gallery];
        newGallery[index] = value;
        setBranding({ ...branding, gallery: newGallery });
    };

    const removeGalleryItem = (index: number) => {
        const newGallery = branding.gallery.filter((_, i) => i !== index);
        setBranding({ ...branding, gallery: newGallery });
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-zinc-500 font-black uppercase tracking-widest text-xs">Cargando identidad...</div>;

    return (
        <div className="space-y-12 max-w-5xl pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3 italic">
                        <Globe className="w-10 h-10 text-[#D4AF37]" />
                        Identidad de Marca
                    </h1>
                    <p className="text-zinc-500 mt-2 font-medium uppercase text-[10px] tracking-[0.2em]">Personaliza el look & feel para tus clientes</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-[#D4AF37] text-black px-8 py-4 font-black uppercase text-xs tracking-widest shadow-xl shadow-[#D4AF37]/20">
                    {saving ? 'Guardando...' : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Logo Section */}
                <Card className="md:col-span-1 p-8 bg-zinc-900/40 border-white/5 space-y-8 rounded-[2.5rem]">
                    <div className="space-y-2">
                        <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Camera className="w-4 h-4 text-[#D4AF37]" /> Logo Principal
                        </h2>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Se verá en la portada principal</p>
                    </div>

                    <div className="relative group aspect-square rounded-[2rem] bg-black border border-white/5 overflow-hidden flex items-center justify-center p-4">
                        {branding.logoUrl ? (
                            <img src={branding.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <ImageIcon className="w-12 h-12 text-zinc-800" />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">Vista Previa</p>
                        </div>
                    </div>

                    <Input
                        label="URL del Logo"
                        placeholder="https://..."
                        value={branding.logoUrl}
                        onChange={(e: any) => setBranding({ ...branding, logoUrl: e.target.value })}
                    />
                </Card>

                {/* Gallery Section */}
                <Card className="md:col-span-2 p-8 bg-zinc-900/40 border-white/5 space-y-8 rounded-[2.5rem]">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-[#D4AF37]" /> Galería de Portada
                            </h2>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Presentación de imágenes (Máx 10)</p>
                        </div>
                        <Button onClick={addGalleryItem} variant="outline" className="px-4 py-2 text-[10px] border-zinc-800 text-zinc-400 hover:text-[#D4AF37]">
                            <Plus className="w-3 h-3" /> Agregar Imagen
                        </Button>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                        {branding.gallery.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Sin imágenes configuradas</p>
                            </div>
                        )}
                        {branding.gallery.map((url, idx) => (
                            <div key={idx} className="flex gap-4 items-end bg-black/20 p-4 rounded-3xl border border-white/5">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/5">
                                    {url ? <img src={url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-zinc-800" /></div>}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        label={`Imagen ${idx + 1}`}
                                        value={url}
                                        onChange={(e: any) => updateGalleryItem(idx, e.target.value)}
                                        placeholder="URL de la imagen..."
                                    />
                                </div>
                                <button
                                    onClick={() => removeGalleryItem(idx)}
                                    className="p-3 text-red-500/50 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
