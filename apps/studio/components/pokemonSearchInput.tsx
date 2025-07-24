import React, { useState, useEffect, useCallback } from 'react';
import { Card, Stack, TextInput, Button, Flex, Text, Box, Spinner } from '@sanity/ui';
import { SearchIcon, RobotIcon } from '@sanity/icons';
import { PatchEvent, set, unset } from 'sanity';
import type { ObjectInputProps } from 'sanity';
import { PokemonApiResponse, PokemonData, PokemonListResponse } from '../types/pokemon';

interface PokemonInputProps extends ObjectInputProps {
  value?: PokemonData;
  onChange: (event: PatchEvent) => void;
}

const fetchPokemonList = async (query: string): Promise<string[]> => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
    const data: PokemonListResponse = await response.json();
    
    return data.results
      .filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
      .map(pokemon => pokemon.name);
  } catch (error) {
    return [];
  }
};

const fetchPokemonData = async (name: string): Promise<PokemonData | null> => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
    if (!response.ok) return null;
    
    const data: PokemonApiResponse = await response.json();
    
    const spriteUrl = data.sprites.other["official-artwork"].front_default || 
                     data.sprites.front_default || 
                     '';
    
    return {
      id: data.id,
      name: data.name,
      types: data.types.map(typeInfo => typeInfo.type.name),
      spriteUrl,
      height: data.height,
      weight: data.weight,
    };
  } catch (error) {
    return null;
  }
};

export function PokemonSearchInput(props: PokemonInputProps) {
  const { value, onChange } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await fetchPokemonList(query);
        setSuggestions(results);
      } catch (err) {
        setError('Failed to search Pokemon');
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    setError(null);
  };

  const selectPokemon = async (pokemonName: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const pokemonData = await fetchPokemonData(pokemonName);
      
      if (pokemonData) {
        onChange(PatchEvent.from(set(pokemonData)));
        setSearchQuery('');
        setSuggestions([]);
      } else {
        setError('Failed to fetch Pokemon data');
      }
    } catch (err) {
      setError('Failed to fetch Pokemon data');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    onChange(PatchEvent.from(unset()));
    setSearchQuery('');
    setSuggestions([]);
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: '#FF6B6B',
      water: '#4ECDC4',
      electric: '#FFE66D',
      grass: '#95E1D3',
      poison: '#A8E6CF',
      flying: '#88D8B0',
      bug: '#C8E6C9',
      normal: '#F5F5F5',
      ground: '#D7CCC8',
      fairy: '#F8BBD9',
      fighting: '#FFCDD2',
      psychic: '#E1BEE7',
      rock: '#BCAAA4',
      steel: '#CFD8DC',
      ice: '#B3E5FC',
      ghost: '#D1C4E9',
      dragon: '#B39DDB',
      dark: '#A1887F',
    };
    return colors[type] || '#E0E0E0';
  };

  if (value) {
    return (
      <Card padding={4} radius={2} shadow={1}>
        <Stack space={3}>
          <Flex align="center" justify="space-between">
            <Text size={1} weight="semibold">Selected Pokemon</Text>
            <Button
              text="Clear"
              tone="critical"
              mode="ghost"
              onClick={clearSelection}
            />
          </Flex>
          
          <Card padding={3} radius={2} tone="primary">
            <Flex align="center" gap={3}>
              {value.spriteUrl && (
                <Box>
                  <img 
                    src={value.spriteUrl} 
                    alt={value.name}
                    style={{ width: 80, height: 80, objectFit: 'contain' }}
                  />
                </Box>
              )}
              
              <Stack space={2} flex={1}>
                <Text size={3} weight="bold" style={{ textTransform: 'capitalize' }}>
                  {value.name} (#{value.id})
                </Text>
                
                <Flex gap={1} wrap="wrap">
                  {value.types.map((type, index) => (
                    <Box
                      key={index}
                      padding={1}
                      style={{
                        backgroundColor: getTypeColor(type),
                        borderRadius: '12px',
                        color: '#333',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        paddingLeft: '8px',
                        paddingRight: '8px',
                      }}
                    >
                      {type}
                    </Box>
                  ))}
                </Flex>
                
                <Flex gap={3}>
                  <Text size={1}>Height: {(value.height / 10).toFixed(1)}m</Text>
                  <Text size={1}>Weight: {(value.weight / 10).toFixed(1)}kg</Text>
                </Flex>
              </Stack>
            </Flex>
          </Card>
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={1} weight="semibold">Search Pokemon</Text>
        
        <TextInput
          icon={SearchIcon}
          placeholder="Search for a Pokemon (e.g., pikachu, charizard)"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={isLoading}
        />

        {error && (
          <Card padding={2} tone="critical" radius={1}>
            <Text size={1}>{error}</Text>
          </Card>
        )}

        {isSearching && (
          <Flex align="center" justify="center" padding={2}>
            <Spinner muted />
            <Text size={1} muted style={{ marginLeft: 8 }}>Searching...</Text>
          </Flex>
        )}

        {suggestions.length > 0 && (
          <Card padding={0} radius={1} shadow={1}>
            <Stack space={0}>
              {suggestions.map((pokemonName, index) => (
                <Button
                  key={pokemonName}
                  text={pokemonName}
                  mode="ghost"
                  justify="flex-start"
                  icon={RobotIcon}
                  onClick={() => selectPokemon(pokemonName)}
                  disabled={isLoading}
                  style={{
                    textTransform: 'capitalize',
                    borderRadius: index === 0 ? '4px 4px 0 0' : index === suggestions.length - 1 ? '0 0 4px 4px' : '0',
                  }}
                />
              ))}
            </Stack>
          </Card>
        )}

        {isLoading && (
          <Flex align="center" justify="center" padding={3}>
            <Spinner />
            <Text size={1} style={{ marginLeft: 8 }}>Loading Pokemon data...</Text>
          </Flex>
        )}
      </Stack>
    </Card>
  );
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 