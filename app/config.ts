export const STORED_AI_KEY = "self-driving-neuralnetwork";

export const ROAD_WIDTH = 300;
export const CAR_WIDTH = 30;
export const CAR_HEIGHT = 50;

export const AI_CAR_ALPHA = 0.1;
export const AI_NUM_CARS = 100;
export const AI_MUTATION_BASERATE = 0.2;
export const AI_MUTATION_GROUPS = [
    { threshold: 0.9, rate: 10 },
    { threshold: 0.8, rate: 5 },
    { threshold: 0.75, rate: 2 },
    { threshold: 0.5, rate: 1.5 },
    { threshold: 0.0, rate: 1 },
];

export const NUM_TRAFFIC_CARS = 50;

export const UPDATES_PER_SECOND = 60;