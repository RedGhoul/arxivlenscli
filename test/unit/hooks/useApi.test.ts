describe('useApi (smoke test)', () => {
	it('can be imported', async () => {
		const module = await import('../../source/hooks/useApi.js');
		expect(typeof module.useApi).toBe('function');
	});

	it('exports expected properties', async () => {
		const {useApi} = await import('../../source/hooks/useApi.js');
		expect(typeof useApi()).toBe('function');
	});
});
