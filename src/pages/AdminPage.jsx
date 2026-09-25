import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import LocationPicker from '@/components/LocationPicker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Upload, 
  Loader2, 
  LogOut, 
  X, 
  Pencil, 
  Trash2, 
  Star, 
  Car, 
  PlusCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Tag,
  Gauge,
  Calendar,
  Fuel,
  Cog,
  Palette,
  DollarSign
} from 'lucide-react';

const AVAILABLE_FEATURES = [
  'Aire Acondicionado',
  'Cámara de Retroceso',
  'Sensores de Estacionamiento',
  'Asientos de Cuero',
  'Techo Panorámico',
  'Bluetooth / Apple CarPlay',
  'Control de Crucero',
  'Frenos ABS / ESP',
  'Llantas de Aleación',
  'Cierre Centralizado',
  'Dirección Asistida',
  'GPS / Navegador'
];

const INITIAL_FORM_STATE = {
  title: '',
  brand: '',
  model: '',
  year: new Date().getFullYear().toString(),
  price: '',
  currency: 'USD',
  mileage: '',
  fuel_type: 'nafta',
  transmission: 'manual',
  color: '',
  location: '',
  latitude: null,
  longitude: null,
  type: 'auto',
  operation: 'venta',
  description: '',
  status: 'disponible',
  featured: false,
  features: []
};

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loading, setLoading] = useState(false);

  // Estados para imágenes en creación o edición activa
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Estado para modal de edición
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Formulario compartido (crear / editar)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // 1. Cargar el inventario de vehículos desde Supabase
  const fetchVehicles = async () => {
    setLoadingList(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error al cargar vehículos:', error);
      toast.error('No se pudo obtener el inventario de vehículos.');
    } else {
      setVehicles(data || []);
    }
    setLoadingList(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Manejo de imágenes agregadas localmente
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Subida de archivos a Supabase Storage
  const uploadImagesToStorage = async (files) => {
    const uploadedUrls = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `vehicles/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('vehicles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }
    return uploadedUrls;
  };

  // Reset del formulario e imágenes
  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setImageFiles([]);
    setImagePreviews([]);
  };

  // 2. Crear nuevo vehículo
  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error('Por favor, selecciona al menos una imagen para el vehículo.');
      return;
    }

    setLoading(true);

    try {
      const uploadedUrls = await uploadImagesToStorage(imageFiles);

      const { error: dbError } = await supabase.from('vehicles').insert([
        {
          title: formData.title,
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year) || new Date().getFullYear(),
          price: Number(formData.price) || 0,
          currency: formData.currency || 'USD',
          mileage: Number(formData.mileage) || 0,
          fuel_type: formData.fuel_type,
          transmission: formData.transmission,
          color: formData.color || '',
          location: formData.location || '',
          latitude: formData.latitude ?? null,
          longitude: formData.longitude ?? null,
          type: formData.type,
          operation_type: formData.operation,
          description: formData.description,
          status: formData.status || 'disponible',
          featured: formData.featured,
          features: formData.features || [],
          image: uploadedUrls[0],
          images: uploadedUrls,
        },
      ]);

      if (dbError) throw dbError;

      toast.success('¡Vehículo publicado con éxito!');
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Abrir modal y pre-cargar datos para Editar
  const handleOpenEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      title: vehicle.title || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year ? String(vehicle.year) : '',
      price: vehicle.price ? String(vehicle.price) : '',
      currency: vehicle.currency || 'USD',
      mileage: vehicle.mileage ? String(vehicle.mileage) : '0',
      fuel_type: vehicle.fuel_type || 'nafta',
      transmission: vehicle.transmission || 'manual',
      color: vehicle.color || '',
      location: vehicle.location || '',
      latitude: vehicle.latitude ?? null,
      longitude: vehicle.longitude ?? null,
      type: vehicle.type || 'auto',
      operation: vehicle.operation_type || vehicle.operation || 'venta',
      description: vehicle.description || '',
      status: vehicle.status || 'disponible',
      featured: Boolean(vehicle.featured),
      features: Array.isArray(vehicle.features) ? vehicle.features : []
    });

    setImageFiles([]);
    setImagePreviews(
      vehicle.images && vehicle.images.length > 0
        ? vehicle.images
        : vehicle.image
        ? [vehicle.image]
        : []
    );
    setIsEditDialogOpen(true);
  };

  // 4. Guardar cambios editados
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingVehicle) return;

    setLoading(true);

    try {
      let finalImages = [...(editingVehicle.images || [])];

      if (imageFiles.length > 0) {
        const newUploadedUrls = await uploadImagesToStorage(imageFiles);
        finalImages = [...finalImages, ...newUploadedUrls];
      }

      if (finalImages.length === 0 && imagePreviews.length > 0) {
        finalImages = imagePreviews.filter((url) => typeof url === 'string' && url.startsWith('http'));
      }

      const payload = {
        title: formData.title,
        brand: formData.brand,
        model: formData.model,
        year: Number(formData.year) || new Date().getFullYear(),
        price: Number(formData.price) || 0,
        currency: formData.currency,
        mileage: Number(formData.mileage) || 0,
        fuel_type: formData.fuel_type,
        transmission: formData.transmission,
        color: formData.color || '',
        location: formData.location || '',
        latitude: formData.latitude ?? null,
        longitude: formData.longitude ?? null,
        type: formData.type,
        operation_type: formData.operation,
        description: formData.description,
        status: formData.status,
        featured: formData.featured,
        features: formData.features || [],
        image: finalImages[0] || editingVehicle.image,
        images: finalImages,
      };

      const { error } = await supabase
        .from('vehicles')
        .update(payload)
        .eq('id', editingVehicle.id);

      if (error) throw error;

      toast.success('Vehículo actualizado correctamente');
      setIsEditDialogOpen(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Eliminar vehículo
  const handleDeleteVehicle = async (id, title) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    const { error } = await supabase.from('vehicles').delete().eq('id', id);

    if (error) {
      toast.error('Error al eliminar el vehículo');
    } else {
      toast.success('Vehículo eliminado correctamente');
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  // 6. Cambiar el estado rápido desde la tabla
  const handleStatusChange = async (id, newStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v))
    );

    const { error } = await supabase
      .from('vehicles')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast.error('Error al actualizar el estado');
      fetchVehicles();
    } else {
      toast.success(`Estado actualizado a: ${newStatus}`);
    }
  };

  // 7. Toggle rápido de destacado
  const handleToggleFeatured = async (vehicle) => {
    const newFeatured = !vehicle.featured;

    setVehicles((prev) =>
      prev.map((v) => (v.id === vehicle.id ? { ...v, featured: newFeatured } : v))
    );

    const { error } = await supabase
      .from('vehicles')
      .update({ featured: newFeatured })
      .eq('id', vehicle.id);

    if (error) {
      toast.error('Error al cambiar destacado');
      fetchVehicles();
    } else {
      toast.success(newFeatured ? 'Marcado como Destacado' : 'Quitado de Destacados');
    }
  };

  const handleLogout = () => supabase.auth.signOut();

  // Estadísticas rápidas para métricas
  const totalAvailable = vehicles.filter(v => (v.status || 'disponible') === 'disponible').length;
  const totalReserved = vehicles.filter(v => v.status === 'reservado').length;
  const totalFeatured = vehicles.filter(v => v.featured).length;

  // Helper para badge de estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'disponible':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'reservado':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'vendido':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 my-6 space-y-8">
      {/* Header Estilizado con Gradiente */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 p-8 text-white shadow-xl border border-zinc-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Control de Catálogo de Vehículos
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Panel de Administración
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Administra, crea y gestiona tu inventario de autos y vehículos de forma dinámica.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2 bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-600 hover:text-white transition-all duration-200 backdrop-blur-md shadow-lg"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Tarjetas Métricas / KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <Car className="w-4 h-4" />
              </div>
              Total Vehículos
            </div>
            <p className="text-2xl font-bold text-white mt-2">{vehicles.length}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              Disponibles
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{totalAvailable}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              Reservados
            </div>
            <p className="text-2xl font-bold text-amber-400 mt-2">{totalReserved}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
              <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                <Star className="w-4 h-4" />
              </div>
              Destacados
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-2">{totalFeatured}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 inline-flex gap-2">
          <TabsTrigger 
            value="list" 
            className="gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent"
          >
            <Car className="w-4 h-4" /> 
            <span>Inventario Activo</span>
            <Badge className="ml-1.5 bg-white/20 text-white hover:bg-white/30 border-none px-2 py-0.5 text-xs rounded-full">
              {vehicles.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger 
            value="create" 
            className="gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md border border-transparent" 
            onClick={resetForm}
          >
            <PlusCircle className="w-4 h-4" /> Publicar Vehículo
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: LISTADO E INVENTARIO */}
        <TabsContent value="list">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Catálogo de Vehículos
              </CardTitle>
              <CardDescription>
                Gestiona disponibilidades, estados, destacados o modifica detalles técnicos de tus vehículos.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              {loadingList ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                  <p className="text-sm text-muted-foreground font-medium">Cargando inventario...</p>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground space-y-3">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Car className="w-8 h-8" />
                  </div>
                  <p className="text-lg font-medium text-foreground">No hay vehículos registrados</p>
                  <p className="text-sm">Comienza agregando un nuevo vehículo con el botón "Publicar Vehículo".</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 font-bold text-xs uppercase tracking-wider">
                        <th className="p-4 rounded-tl-xl">Vehículo</th>
                        <th className="p-4">Año / Km</th>
                        <th className="p-4">Precio</th>
                        <th className="p-4">Tipo / Operación</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-center">Destacado</th>
                        <th className="p-4 text-right rounded-tr-xl">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {vehicles.map((veh) => (
                        <tr key={veh.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-3.5">
                              <div className="relative">
                                <img
                                  src={veh.image || (veh.images && veh.images[0]) || '/placeholder-car.jpg'}
                                  alt=""
                                  className="w-16 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                                />
                                {veh.featured && (
                                  <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 rounded-full p-1 shadow">
                                    <Star className="w-3 h-3 fill-slate-900" />
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 text-base">{veh.title}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-blue-500" /> {veh.location || 'Sin ubicación'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="text-slate-800 dark:text-slate-200 font-semibold">{veh.year}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Gauge className="w-3 h-3 text-slate-400" />
                              {Number(veh.mileage || 0).toLocaleString('es-AR')} km
                            </div>
                          </td>
                          <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 text-base whitespace-nowrap">
                            {veh.currency || 'USD'} ${Number(veh.price || 0).toLocaleString('es-AR')}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1 items-start">
                              <Badge variant="outline" className="capitalize bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 px-2.5 py-0.5">
                                {veh.type || 'Vehículo'}
                              </Badge>
                              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                {veh.operation_type || veh.operation || 'Venta'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <Select
                              value={veh.status || 'disponible'}
                              onValueChange={(val) => handleStatusChange(veh.id, val)}
                            >
                              <SelectTrigger className={`w-[140px] h-9 text-xs font-bold border rounded-xl shadow-sm transition-all ${getStatusBadgeClass(veh.status || 'disponible')}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                <SelectItem value="disponible">🟢 Disponible</SelectItem>
                                <SelectItem value="reservado">🟡 Reservado</SelectItem>
                                <SelectItem value="vendido">🔴 Vendido</SelectItem>
                                <SelectItem value="borrador">⚪ Borrador</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-4 text-center whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleFeatured(veh)}
                              title={veh.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
                              className={`rounded-full p-2 ${veh.featured ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'}`}
                            >
                              <Star className={`w-5 h-5 ${veh.featured ? 'fill-amber-500' : ''}`} />
                            </Button>
                          </td>
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenEditModal(veh)}
                                title="Editar"
                                className="rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 border-slate-200 dark:border-slate-700"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleDeleteVehicle(veh.id, veh.title)}
                                title="Eliminar"
                                className="rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/40"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: CREAR NUEVA PUBLICACIÓN DE VEHÍCULO */}
        <TabsContent value="create">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden bg-card">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Cargar Nuevo Vehículo
              </CardTitle>
              <CardDescription>Completa la ficha técnica para publicar el vehículo en el catálogo.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 p-6">
              <VehicleForm
                formData={formData}
                setFormData={setFormData}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
                imagePreviews={imagePreviews}
                onSubmit={handleCreateSubmit}
                loading={loading}
                submitText="Publicar Vehículo"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL DE EDICIÓN */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border-slate-200 dark:border-slate-800 shadow-2xl p-6">
          <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Pencil className="w-5 h-5 text-blue-600" /> Editar Vehículo
            </DialogTitle>
            <DialogDescription>
              Modifica las especificaciones, precios o imágenes de la publicación seleccionada.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4">
            <VehicleForm
              formData={formData}
              setFormData={setFormData}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              imagePreviews={imagePreviews}
              onSubmit={handleUpdateSubmit}
              loading={loading}
              submitText="Guardar Cambios"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Subcomponente de Formulario Adaptado a Vehículos
function VehicleForm({
  formData,
  setFormData,
  handleImageChange,
  removeImage,
  imagePreviews,
  onSubmit,
  loading,
  submitText,
}) {

  const handleFeatureToggle = (feature) => {
    const current = formData.features || [];
    const updated = current.includes(feature)
      ? current.filter((item) => item !== feature)
      : [...current, feature];

    setFormData({ ...formData, features: updated });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Título */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-blue-500" /> Título de la publicación
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Volkswagen Gol Trend 1.6 MSI 5ptas Highline"
          required
          className="rounded-xl border-slate-300 dark:border-slate-700 focus:ring-blue-500 h-11"
        />
      </div>

      {/* Marca, Modelo, Año y Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Marca
          </label>
          <Input
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Ej: Volkswagen"
            required
            className="rounded-xl h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Modelo
          </label>
          <Input
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Ej: Gol Trend"
            required
            className="rounded-xl h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Calendar className="w-4 h-4 text-blue-500" /> Año
          </label>
          <Input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            placeholder="2020"
            required
            className="rounded-xl h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Palette className="w-4 h-4 text-blue-500" /> Color
          </label>
          <Input
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="Ej: Gris Plata"
            className="rounded-xl h-11"
          />
        </div>
      </div>

      {/* Moneda, Precio, Kilometraje y Tipo de Operación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Moneda</label>
          <Select
            value={formData.currency}
            onValueChange={(val) => setFormData({ ...formData, currency: val })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="ARS">ARS ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Precio
          </label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="12500"
            required
            className="rounded-xl h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Gauge className="w-4 h-4 text-blue-500" /> Kilometraje (km)
          </label>
          <Input
            type="number"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            placeholder="45000"
            required
            className="rounded-xl h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Operación</label>
          <Select
            value={formData.operation}
            onValueChange={(val) => setFormData({ ...formData, operation: val })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venta">Venta</SelectItem>
              <SelectItem value="alquiler">Alquiler</SelectItem>
              <SelectItem value="permutas">Permuta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Combustible, Transmisión, Tipo de Vehículo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Fuel className="w-4 h-4 text-blue-500" /> Combustible
          </label>
          <Select
            value={formData.fuel_type}
            onValueChange={(val) => setFormData({ ...formData, fuel_type: val })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nafta">Nafta</SelectItem>
              <SelectItem value="diesel">Diésel</SelectItem>
              <SelectItem value="gnc">GNC</SelectItem>
              <SelectItem value="hibrido">Híbrido</SelectItem>
              <SelectItem value="electrico">Eléctrico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Cog className="w-4 h-4 text-blue-500" /> Transmisión
          </label>
          <Select
            value={formData.transmission}
            onValueChange={(val) => setFormData({ ...formData, transmission: val })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatica">Automática</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tipo de Vehículo</label>
          <Select
            value={formData.type}
            onValueChange={(val) => setFormData({ ...formData, type: val })}
          >
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto / Hatchback / Sedan</SelectItem>
              <SelectItem value="suv">SUV / Pick-Up</SelectItem>
              <SelectItem value="moto">Moto</SelectItem>
              <SelectItem value="utilitario">Utilitario</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* SECCIÓN ÚNICA DE UBICACIÓN (OPCIONAL) */}
      <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-blue-500" /> Ubicación <span className="text-xs text-muted-foreground font-normal">(Opcional)</span>
        </label>
        
        {/* Un solo componente de buscador de ubicación */}
        <LocationPicker
          value={formData.location}
          onChange={(loc) => {
            setFormData({
              ...formData,
              location: loc.address || '',
              latitude: loc.lat ?? null,
              longitude: loc.lng ?? null
            });
          }}
        />
      </div>

      {/* Características / Equipamiento */}
      <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Equipamiento y Características</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {AVAILABLE_FEATURES.map((feature) => {
            const isSelected = (formData.features || []).includes(feature);
            return (
              <button
                type="button"
                key={feature}
                onClick={() => handleFeatureToggle(feature)}
                className={`p-2.5 text-xs rounded-xl font-medium border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {feature}
              </button>
            );
          })}
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Descripción detallada</label>
        <Textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Menciona detalles del estado del motor, mantenimientos realizados, ITV/VTV, etc."
          className="rounded-xl border-slate-300 dark:border-slate-700"
        />
      </div>

      {/* Subida de Imágenes */}
      <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Fotos del Vehículo</label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {imagePreviews.map((src, index) => (
            <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100">
              <img src={src} alt="Vista previa" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1.5 right-1.5 bg-rose-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 shadow transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50">
            <Upload className="w-6 h-6 text-slate-400 mb-1" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Subir imágenes</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-xl text-base font-bold shadow-lg transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Guardando...
            </>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </form>
  );
}