console.log('main.js loaded');

export function setup(ctx) {
    let marksDictionary = {};

    // Define your custom function
    function openBetterSynergiesBreakdown() {
        console.log('openBetterSynergiesBreakdown function called');
        let _a;
        if (!game.summoning.isUnlocked) {
            console.log('Summoning is not unlocked');
            lockedSkillAlert(game.summoning, 'SKILL_UNLOCK_OPEN_MENU');
        } else {
            console.log('BetterSynergyMenu: Summoning is unlocked');
            summoningSearchMenu.updateVisibleElementUnlocks();
            summoningSearchMenu.updateVisibleElementQuantities();
            $('#modal-summoning-synergy').modal('show');
            if (((_a = game.openPage) === null || _a === void 0 ? void 0 : _a.action) !== undefined) {
                const action = game.openPage.action;
                console.log('BetterSynergyMenu: Action found:', action);
                if (action instanceof Skill) {
                    console.log('BetterSynergyMenu: Action is an instance of Skill');
                    const searchResults = Summoning.searchArray.filter(s => marksDictionary[action._localID].indexOf(s.synergy) != -1);
                    console.log('BetterSynergyMenu: Search results:', searchResults);
                    const newVisibleSet = new Set();
                    searchResults.forEach((result) => {
                        const synergyElement = summoningSearchMenu.searchElements.get(result.synergy);
                        if (synergyElement === undefined) {
                            console.error('BetterSynergyMenu: Search result has no corresponding synergy display');
                            throw new Error('BetterSynergyMenu: Search result has no corresponding synergy display');
                        }
                        newVisibleSet.add(synergyElement);
                        synergyElement.classList.remove('d-none');
                    });
                    summoningSearchMenu.visibleSynergies.forEach((synergyElement) => {
                        if (!newVisibleSet.has(synergyElement))
                            synergyElement.classList.add('d-none');
                    });
                    summoningSearchMenu.visibleSynergies = newVisibleSet;
                    if (searchResults.length === 0) {
                        console.log('No search results found');
                        summoningSearchMenu.searchBar.classList.add('text-danger');
                    } else {
                        console.log('Search results found');
                        summoningSearchMenu.searchBar.classList.remove('text-danger');
                    }
                    return;
                }
            }
            console.log('BetterSynergyMenu: Showing all synergies');
            summoningSearchMenu.showAllSynergies();
        }
    }

    function initializeDictionary() {
        console.log('initializeDictionary function called');
        Array.from(game.skills.registeredObjects.values()).filter(s => !s.isCombat).map(s => s._localID).forEach(skill => {
            console.log('BetterSynergyMenu: Processing skill:', skill);
            marksDictionary[skill] = game.summoning.synergies.filter(s => s.consumesOn.filter(c => c.constructor.name.indexOf(skill) != -1).length > 0);
            console.log('BetterSynergyMenu: Marks dictionary updated for skill:', skill, marksDictionary[skill]);
        });
    }

    ctx.onInterfaceReady((ctx) => {
        console.log('Interface is ready');
        initializeDictionary();

        // Overwrite the game's function with the custom one
        openSynergiesBreakdown = (...args) => {
            try {
                console.log('BetterSynergyMenu: Override openSynergiesBreakdown attempted');
                openBetterSynergiesBreakdown();
            } catch (e) {
                console.error(e);
            }
        };

        console.log('BetterSynergyMenu: openSynergiesBreakdown function overridden successfully');
    });
}