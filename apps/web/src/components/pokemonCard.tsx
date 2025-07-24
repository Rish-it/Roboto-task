"use client";

import React from 'react';
import { Badge } from '@workspace/ui/components/badge';

interface PokemonData {
  id: number;
  name: string;
  types: string[];
  spriteUrl: string;
  height: number;
  weight: number;
}

interface PokemonCardProps {
  pokemon: PokemonData;
}

const typeColors: Record<string, { bg: string; text: string; gradient: string }> = {
  fire: { 
    bg: 'bg-gradient-to-br from-red-400 to-orange-500', 
    text: 'text-white',
    gradient: 'from-red-400/20 to-orange-500/20'
  },
  water: { 
    bg: 'bg-gradient-to-br from-blue-400 to-cyan-500', 
    text: 'text-white',
    gradient: 'from-blue-400/20 to-cyan-500/20'
  },
  electric: { 
    bg: 'bg-gradient-to-br from-yellow-400 to-amber-500', 
    text: 'text-gray-900',
    gradient: 'from-yellow-400/20 to-amber-500/20'
  },
  grass: { 
    bg: 'bg-gradient-to-br from-green-400 to-emerald-500', 
    text: 'text-white',
    gradient: 'from-green-400/20 to-emerald-500/20'
  },
  poison: { 
    bg: 'bg-gradient-to-br from-purple-400 to-violet-500', 
    text: 'text-white',
    gradient: 'from-purple-400/20 to-violet-500/20'
  },
  flying: { 
    bg: 'bg-gradient-to-br from-indigo-400 to-sky-500', 
    text: 'text-white',
    gradient: 'from-indigo-400/20 to-sky-500/20'
  },
  bug: { 
    bg: 'bg-gradient-to-br from-lime-400 to-green-500', 
    text: 'text-gray-900',
    gradient: 'from-lime-400/20 to-green-500/20'
  },
  normal: { 
    bg: 'bg-gradient-to-br from-gray-400 to-slate-500', 
    text: 'text-white',
    gradient: 'from-gray-400/20 to-slate-500/20'
  },
  ground: { 
    bg: 'bg-gradient-to-br from-amber-600 to-orange-700', 
    text: 'text-white',
    gradient: 'from-amber-600/20 to-orange-700/20'
  },
  fairy: { 
    bg: 'bg-gradient-to-br from-pink-400 to-rose-500', 
    text: 'text-white',
    gradient: 'from-pink-400/20 to-rose-500/20'
  },
  fighting: { 
    bg: 'bg-gradient-to-br from-red-600 to-red-700', 
    text: 'text-white',
    gradient: 'from-red-600/20 to-red-700/20'
  },
  psychic: { 
    bg: 'bg-gradient-to-br from-pink-500 to-purple-600', 
    text: 'text-white',
    gradient: 'from-pink-500/20 to-purple-600/20'
  },
  rock: { 
    bg: 'bg-gradient-to-br from-yellow-600 to-amber-700', 
    text: 'text-white',
    gradient: 'from-yellow-600/20 to-amber-700/20'
  },
  steel: { 
    bg: 'bg-gradient-to-br from-gray-500 to-gray-600', 
    text: 'text-white',
    gradient: 'from-gray-500/20 to-gray-600/20'
  },
  ice: { 
    bg: 'bg-gradient-to-br from-cyan-400 to-blue-500', 
    text: 'text-white',
    gradient: 'from-cyan-400/20 to-blue-500/20'
  },
  ghost: { 
    bg: 'bg-gradient-to-br from-purple-600 to-indigo-700', 
    text: 'text-white',
    gradient: 'from-purple-600/20 to-indigo-700/20'
  },
  dragon: { 
    bg: 'bg-gradient-to-br from-purple-700 to-indigo-800', 
    text: 'text-white',
    gradient: 'from-purple-700/20 to-indigo-800/20'
  },
  dark: { 
    bg: 'bg-gradient-to-br from-gray-700 to-gray-800', 
    text: 'text-white',
    gradient: 'from-gray-700/20 to-gray-800/20'
  },
};

const getMainTypeStyle = (type: string) => {
  return typeColors[type] || { 
    bg: 'bg-gradient-to-br from-gray-400 to-gray-500', 
    text: 'text-white',
    gradient: 'from-gray-400/20 to-gray-500/20'
  };
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const mainType = pokemon.types[0];
  const mainTypeStyle = getMainTypeStyle(mainType);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`relative rounded-3xl p-6 shadow-xl overflow-hidden ${mainTypeStyle.bg}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${mainTypeStyle.gradient} opacity-50`} />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`text-2xl font-bold capitalize ${mainTypeStyle.text} mb-1`}>
                {pokemon.name}
              </h3>
              <p className={`text-sm opacity-80 ${mainTypeStyle.text}`}>
                #{pokemon.id.toString().padStart(3, '0')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1 max-w-24">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="text-xs px-2 py-1 bg-white/20 text-white backdrop-blur-sm border-white/30 capitalize"
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
              <img
                src={pokemon.spriteUrl}
                alt={pokemon.name}
                className="relative z-10 w-32 h-32 object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className={`text-lg font-bold ${mainTypeStyle.text}`}>
                {(pokemon.height / 10).toFixed(1)}m
              </p>
              <p className={`text-xs opacity-70 ${mainTypeStyle.text}`}>Height</p>
            </div>
            <div className="text-center">
              <p className={`text-lg font-bold ${mainTypeStyle.text}`}>
                {(pokemon.weight / 10).toFixed(1)}kg
              </p>
              <p className={`text-xs opacity-70 ${mainTypeStyle.text}`}>Weight</p>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 opacity-10">
          <div className="w-20 h-20 rounded-full border-4 border-white" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <div className="w-12 h-12 rounded-full border-4 border-white" />
        </div>
      </div>
    </div>
  );
} 