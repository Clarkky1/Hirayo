# Lender Messages Component

This component provides a dedicated interface for lenders to view and manage messages from renters who have contacted them about their rental items.

## Features

- **Message List**: Displays all messages from renters
- **Search Functionality**: Search through messages by renter name or item name
- **Message Cards**: Each message shows renter info, item details, and last message
- **Navigation**: Tap on a message to view the full conversation

## Structure

- `LenderMessagesScreen.tsx` - Main component for displaying lender messages
- `index.ts` - Export file for the component

## Usage

The component is used in the `/lender-messages` route and can be accessed from the lenders dashboard via the Messages quick action button.

## Navigation

- Messages are displayed in a scrollable list
- Tapping a message navigates to `/view-messages` for the full conversation
- The component integrates with the existing navigation system
