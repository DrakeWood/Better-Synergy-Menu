export function setup(ctx) {
    const id = 'better_summoning_menu';
    const title = 'Better Summoning Menu';
    const desc = "Only show synergies for the current page";

    let marksDictionary = {}

    function openSynergiesBreakdown() {
        var _a;
        if (!game.summoning.isUnlocked) {
            lockedSkillAlert(game.summoning, 'SKILL_UNLOCK_OPEN_MENU');
        } else {
            summoningSearchMenu.updateVisibleElementUnlocks();
            summoningSearchMenu.updateVisibleElementQuantities();
            $('#modal-summoning-synergy').modal('show');
            let markToShow;
            if (((_a = game.openPage) === null || _a === void 0 ? void 0 : _a.action) !== undefined) {
                const action = game.openPage.action;
                if (action instanceof Skill){
                    const searchResults = Summoning.searchArray.filter(s => marksDictionary[action._localID].indexOf(s.synergy) != -1)
                    const newVisibleSet = new Set();
                    searchResults.forEach((result)=>{
                        const synergyElement = summoningSearchMenu.searchElements.get(result.synergy);
                        if (synergyElement === undefined)
                            throw new Error('Search result has no corresponding synergy display');
                        newVisibleSet.add(synergyElement);
                        synergyElement.classList.remove('d-none');
                    }
                    );
                    summoningSearchMenu.visibleSynergies.forEach((synergyElement)=>{
                        if (!newVisibleSet.has(synergyElement))
                            synergyElement.classList.add('d-none');
                    }
                    );
                    summoningSearchMenu.visibleSynergies = newVisibleSet;
                    if (searchResults.length === 0) {
                        summoningSearchMenu.searchBar.classList.add('text-danger');
                    } else {
                        summoningSearchMenu.searchBar.classList.remove('text-danger');
                    }
                    return
                }
            }
            
            summoningSearchMenu.showAllSynergies();
        }
    }

    function initializeDictionary(){
        Array.from(game.skills.registeredObjects.values()).filter(s => !s.isCombat).map(s => s._localID).forEach(skill => {
            marksDictionary[skill] = game.summoning.synergies.filter(s => s.consumesOn.filter(c => c.constructor.name.indexOf(skill) != -1).length > 0)
        });
    }

    ctx.onInterfaceReady((ctx) => {
        initializeDictionary()
        $("#minibar-summoning")[0].onclick = () => openSynergiesBreakdown();
    })
}
