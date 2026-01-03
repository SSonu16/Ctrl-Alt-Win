import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface SavedDestination {
  id: string;
  user_id: string;
  destination_name: string;
  destination_image: string | null;
  state_name: string | null;
  created_at: string;
}

export function useSavedDestinations() {
  const [savedDestinations, setSavedDestinations] = useState<SavedDestination[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedDestinations = async () => {
    if (!user) {
      setSavedDestinations([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('saved_destinations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedDestinations(data || []);
    } catch (error: any) {
      console.error('Error fetching saved destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedDestinations();
  }, [user]);

  const saveDestination = async (destination: {
    destination_name: string;
    destination_image?: string;
    state_name?: string;
  }) => {
    if (!user) return { error: new Error('No user logged in'), data: null };

    try {
      const { data, error } = await supabase
        .from('saved_destinations')
        .insert({
          ...destination,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setSavedDestinations(prev => [data, ...prev]);
      toast({
        title: 'Saved!',
        description: `${destination.destination_name} added to your saved destinations.`,
      });
      return { error: null, data };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to save destination.',
        variant: 'destructive',
      });
      return { error, data: null };
    }
  };

  const removeDestination = async (destinationId: string) => {
    try {
      const { error } = await supabase
        .from('saved_destinations')
        .delete()
        .eq('id', destinationId);

      if (error) throw error;

      setSavedDestinations(prev => prev.filter(d => d.id !== destinationId));
      toast({
        title: 'Removed',
        description: 'Destination removed from saved list.',
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to remove destination.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  const isDestinationSaved = (destinationName: string) => {
    return savedDestinations.some(d => d.destination_name === destinationName);
  };

  return {
    savedDestinations,
    loading,
    fetchSavedDestinations,
    saveDestination,
    removeDestination,
    isDestinationSaved,
  };
}
