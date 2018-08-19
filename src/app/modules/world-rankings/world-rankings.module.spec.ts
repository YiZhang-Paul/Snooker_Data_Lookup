import { WorldRankingsModule } from './world-rankings.module';

describe('WorldRankingsModule', () => {
  let worldRankingsModule: WorldRankingsModule;

  beforeEach(() => {
    worldRankingsModule = new WorldRankingsModule();
  });

  it('should create an instance', () => {
    expect(worldRankingsModule).toBeTruthy();
  });
});
