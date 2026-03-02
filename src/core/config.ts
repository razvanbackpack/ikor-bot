export const BOT_INFO = {
    name: 'IKOR',
    version: '0.1.2',

    features: {
        xp_system: true,
        commands: true
    },

    xp_system: {
        base: 10, // used to calculate each level's required xp
        exponent: 0, //this will use exponent (base*level^exponent) instead of base * level^2
        cooldown: 10,
        modifier: 1,
        xp_per_message: 20,
    }
    
};

export const MESSAGE_STRINGS = {  
    leaderboard_title: "SERVER LEADERBOARD",
    levelup_message: "Congratulations! You leveled up to #NEW_LEVEL#",
};
