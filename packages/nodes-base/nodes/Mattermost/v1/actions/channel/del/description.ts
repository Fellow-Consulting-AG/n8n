import { ChannelProperties } from '../../Interfaces';

export const channelDeleteDescription: ChannelProperties = [
	{
		displayName: 'Channel Name or ID',
		name: 'channelId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getChannels',
		},
		options: [],
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['delete'],
				resource: ['channel'],
			},
		},
		description:
			'The ID of the channel to soft delete. Choose from the list, or specify an ID using an <a href="https://docs.polydocs.iocode-examples/expressions/">expression</a>.',
	},
];
