// PackPracticeJourneyService.js
const JOURNEY_STAGES = ['noun', 'verb', 'adjective', 'adverb'];

class PackPracticeJourneyService {
  constructor() {
    this.journeys = new Map(); // packId → { state, callbacks }
  }

  initJourney(packId, callbacks) {
    const journeyState = {
      packId,
      stages: JOURNEY_STAGES.map((stage, index) => ({
        id: stage,
        status: index === 0 ? 'unlocked' : 'locked',
        completed: false
      }))
    };
    
    this.journeys.set(packId, { state: journeyState, callbacks });
    this._notifyUpdate(packId);
    return journeyState;
  }

  getJourneyState(packId) {
    const journey = this.journeys.get(packId);
    return journey?.state;
  }

  completeStage(packId, stageId) {
    const journey = this.journeys.get(packId);
    if (!journey) return null;
    
    const stageIndex = JOURNEY_STAGES.indexOf(stageId);
    if (stageIndex === -1) return journey.state;
    
    journey.state.stages[stageIndex].completed = true;
    journey.state.stages[stageIndex].status = 'completed';
    
    if (stageIndex + 1 < JOURNEY_STAGES.length) {
      journey.state.stages[stageIndex + 1].status = 'unlocked';
    }
    
    this._notifyUpdate(packId);
    return journey.state;
  }

  _notifyUpdate(packId) {
    const journey = this.journeys.get(packId);
    if (journey?.callbacks?.onUpdate) {
      journey.callbacks.onUpdate(journey.state);
    }
  }
}

export const packPracticeJourneyService = new PackPracticeJourneyService();