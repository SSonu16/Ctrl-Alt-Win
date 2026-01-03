import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Trip {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  cover_url: string | null;
  budget: number;
  spent: number;
  created_at: string;
  updated_at: string;
}

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTrips = async () => {
    if (!user) {
      setTrips([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setTrips(data || []);
    } catch (error: any) {
      console.error('Error fetching trips:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch trips.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [user]);

  const createTrip = async (tripData: {
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    cover_url?: string;
    budget?: number;
  }) => {
    if (!user) return { error: new Error('No user logged in'), data: null };

    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          ...tripData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setTrips(prev => [...prev, data]);
      return { error: null, data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update(updates)
        .eq('id', tripId)
        .select()
        .single();

      if (error) throw error;

      setTrips(prev => prev.map(t => t.id === tripId ? data : t));
      return { error: null, data };
    } catch (error: any) {
      return { error, data: null };
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      setTrips(prev => prev.filter(t => t.id !== tripId));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return {
    trips,
    loading,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}
