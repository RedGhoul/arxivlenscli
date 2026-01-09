import React, {useState, useEffect, useRef} from 'react';
import {Box, Text, useInput} from 'ink';
import {Header} from '../common/Header.js';
import {Footer} from '../common/Footer.js';
import {Spinner} from '../common/Spinner.js';
import {ErrorMessage} from '../common/ErrorMessage.js';
import {useNavigation} from '../../hooks/useNavigation.js';
import {getKeyFindings} from '../../api/keyFindings.js';
import type {KeyFindings} from '../../api/types.js';

type Tab =
	| 'methodology'
	| 'results'
	| 'significance'
	| 'limitations'
	| 'future';

const TABS: Array<{key: Tab; label: string}> = [
	{key: 'methodology', label: 'Methodology'},
	{key: 'results', label: 'Results'},
	{key: 'significance', label: 'Significance'},
	{key: 'limitations', label: 'Limitations'},
	{key: 'future', label: 'Future'},
];

export function KeyFindingsView() {
	const {params, goBack} = useNavigation();
	const [findings, setFindings] = useState<KeyFindings | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [status, setStatus] = useState('Loading...');
	const [activeTab, setActiveTab] = useState<Tab>('methodology');
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const paperId = params['paperId'] as string;
	const paperTitle = params['paperTitle'] as string | undefined;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await getKeyFindings(paperId);

				if (result.ready) {
					setFindings(result.data.findings);
					setLoading(false);
				} else {
					setStatus(result.data.message || 'Generating key findings...');
					// Poll every 3 seconds
					timeoutRef.current = setTimeout(fetchData, 3000);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'Failed to load key findings',
				);
				setLoading(false);
			}
		};

		if (paperId) {
			fetchData();
		}

		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [paperId]);

	useInput((input, key) => {
		if (key.escape || input === 'q') {
			goBack();
			return;
		}

		if (!loading && findings) {
			if (key.leftArrow) {
				const currentIndex = TABS.findIndex(t => t.key === activeTab);
				const newIndex = currentIndex > 0 ? currentIndex - 1 : TABS.length - 1;
				setActiveTab(TABS[newIndex]!.key);
			}

			if (key.rightArrow) {
				const currentIndex = TABS.findIndex(t => t.key === activeTab);
				const newIndex = currentIndex < TABS.length - 1 ? currentIndex + 1 : 0;
				setActiveTab(TABS[newIndex]!.key);
			}
		}
	});

	const renderTabContent = () => {
		if (!findings) return null;

		switch (activeTab) {
			case 'methodology': {
				return (
					<Box flexDirection="column">
						<Text bold color="gray">
							Methodology:
						</Text>
						<Box marginLeft={2}>
							<Text wrap="wrap">{findings.methodology || 'Not available'}</Text>
						</Box>
						{findings.technicalContribution && (
							<Box marginTop={1} flexDirection="column">
								<Text bold color="gray">
									Technical Contribution:
								</Text>
								<Box marginLeft={2}>
									<Text wrap="wrap">{findings.technicalContribution}</Text>
								</Box>
							</Box>
						)}
						{findings.novelty && (
							<Box marginTop={1} flexDirection="column">
								<Text bold color="gray">
									Novelty:
								</Text>
								<Box marginLeft={2}>
									<Text wrap="wrap">{findings.novelty}</Text>
								</Box>
							</Box>
						)}
					</Box>
				);
			}

			case 'results': {
				return (
					<Box flexDirection="column">
						<Text bold color="gray">
							Key Results:
						</Text>
						<Box marginLeft={2} flexDirection="column">
							{findings.keyResults?.length > 0 ? (
								findings.keyResults.map((result, index) => (
									<Text key={`result-${index}`} wrap="wrap">
										{'\u2022'} {result}
									</Text>
								))
							) : (
								<Text color="gray" dimColor>
									No key results available
								</Text>
							)}
						</Box>
					</Box>
				);
			}

			case 'significance': {
				return (
					<Box flexDirection="column">
						<Text bold color="gray">
							Significance:
						</Text>
						<Box marginLeft={2}>
							<Text wrap="wrap">
								{findings.significance || 'Not available'}
							</Text>
						</Box>
					</Box>
				);
			}

			case 'limitations': {
				return (
					<Box flexDirection="column">
						<Text bold color="gray">
							Limitations:
						</Text>
						<Box marginLeft={2} flexDirection="column">
							{findings.limitations?.length > 0 ? (
								findings.limitations.map((limitation, index) => (
									<Text key={`limitation-${index}`} wrap="wrap">
										{'\u2022'} {limitation}
									</Text>
								))
							) : (
								<Text color="gray" dimColor>
									No limitations listed
								</Text>
							)}
						</Box>
					</Box>
				);
			}

			case 'future': {
				return (
					<Box flexDirection="column">
						<Text bold color="gray">
							Future Work:
						</Text>
						<Box marginLeft={2} flexDirection="column">
							{findings.futureWork?.length > 0 ? (
								findings.futureWork.map((work, index) => (
									<Text key={`work-${index}`} wrap="wrap">
										{'\u2022'} {work}
									</Text>
								))
							) : (
								<Text color="gray" dimColor>
									No future work suggestions
								</Text>
							)}
						</Box>
					</Box>
				);
			}

			default: {
				return null;
			}
		}
	};

	if (loading) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Key Findings" />
				{paperTitle && (
					<Box marginBottom={1}>
						<Text color="gray">{`"${paperTitle}"`}</Text>
					</Box>
				)}
				<Spinner message={status} />
				<Box marginTop={1}>
					<Text color="gray" dimColor>
						This may take a few moments...
					</Text>
				</Box>
				<Footer hints={[]} />
			</Box>
		);
	}

	if (error) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Key Findings" />
				<ErrorMessage message={error} />
				<Footer hints={[]} />
			</Box>
		);
	}

	if (!findings) {
		return (
			<Box flexDirection="column">
				<Header subtitle="Key Findings" />
				<Text color="gray">No key findings available.</Text>
				<Footer hints={[]} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Header subtitle="Key Findings" />
			{paperTitle && (
				<Box marginBottom={1}>
					<Text color="gray">{`"${paperTitle}"`}</Text>
				</Box>
			)}

			<Box marginBottom={1}>
				{TABS.map((tab, index) => (
					<React.Fragment key={tab.key}>
						<Text
							color={activeTab === tab.key ? 'cyan' : 'gray'}
							bold={activeTab === tab.key}
						>
							[{tab.label}]
						</Text>
						{index < TABS.length - 1 && <Text> </Text>}
					</React.Fragment>
				))}
			</Box>

			<Box marginBottom={1} flexDirection="column">
				{renderTabContent()}
			</Box>

			<Footer hints={[{key: '\u2190\u2192', action: 'Switch tabs'}]} />
		</Box>
	);
}
