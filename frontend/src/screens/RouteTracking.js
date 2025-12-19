import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    Switch,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useLocation } from '../context/LocationContext';
import { useSos } from '../context/SosContext';
import PathSimulator from '../modules/PathSimulator';
import SosModule from '../modules/SosModule';
import { GOOGLE_MAPS_CONFIG, MAP_SETTINGS } from '../config/google.config';
import { colors, typography, spacing, borderRadius } from '../styles/theme';

export default function RouteTrackingScreen({ navigation }) {
    const { location, setTracking } = useLocation();
    const { triggerSos, showSosModal, cancelSos } = useSos();

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [checkpoints, setCheckpoints] = useState([]);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [autoMode, setAutoMode] = useState(true);
    const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
    const [showRouteSetup, setShowRouteSetup] = useState(true);

    const mapRef = useRef(null);
    const pathSimulator = useRef(new PathSimulator()).current;

    useEffect(() => {
        // Set initial origin to current location
        if (location && !origin) {
            setOrigin({
                latitude: location.latitude,
                longitude: location.longitude,
            });
        }
    }, [location]);

    useEffect(() => {
        // Update PathSimulator with new location
        if (isMonitoring && location) {
            pathSimulator.updateLocation(location);
        }
    }, [location, isMonitoring]);

    const handleRouteReady = (result) => {
        const coordinates = result.coordinates;
        setRouteCoordinates(coordinates);

        // Generate checkpoints based on mode
        const generatedCheckpoints = pathSimulator.initRoute(coordinates, autoMode ? 'automatic' : 'manual');
        setCheckpoints(generatedCheckpoints);

        // Fit map to show entire route
        if (mapRef.current && coordinates.length > 0) {
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    };

    const handleMapPress = (event) => {
        // Only allow adding checkpoints in manual mode when route is set
        if (!autoMode && routeCoordinates.length > 0 && !isMonitoring) {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            const checkpoint = pathSimulator.addCheckpoint(latitude, longitude);
            setCheckpoints([...pathSimulator.getAllCheckpoints()]);
        }
    };

    const startRouteMonitoring = () => {
        if (!origin || !destination) {
            Alert.alert('Error', 'Please set origin and destination');
            return;
        }

        if (checkpoints.length === 0) {
            Alert.alert('Error', 'No checkpoints available. Please generate a route first.');
            return;
        }

        setIsMonitoring(true);
        setTracking(true);
        setShowRouteSetup(false);

        // Start PathSimulator monitoring
        pathSimulator.startMonitoring(location, {
            onCheckpointReached: (checkpoint, index) => {
                setCurrentCheckpointIndex(index + 1);
                Alert.alert('✓ Checkpoint Reached!', `You reached ${checkpoint.name}`);
            },
            onCheckpointMissed: (checkpoint, index) => {
                // Trigger SOS modal
                triggerSos(location, 'checkpoint', checkpoint);
            }
        });

        Alert.alert(
            'Monitoring Started',
            `Route monitoring started in ${autoMode ? 'Automatic' : 'Manual'} mode. Stay safe!`
        );
    };

    const stopRouteMonitoring = () => {
        setIsMonitoring(false);
        setTracking(false);
        pathSimulator.stopMonitoring();

        Alert.alert('Monitoring Stopped', 'Route monitoring has been stopped.');
    };

    const resetRoute = () => {
        setOrigin(location ? {
            latitude: location.latitude,
            longitude: location.longitude
        } : null);
        setDestination(null);
        setRouteCoordinates([]);
        setCheckpoints([]);
        setIsMonitoring(false);
        setTracking(false);
        setCurrentCheckpointIndex(0);
        setShowRouteSetup(true);
        pathSimulator.reset();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Route Tracking</Text>
                <TouchableOpacity onPress={resetRoute}>
                    <Text style={styles.resetButton}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: origin?.latitude || MAP_SETTINGS.defaultLatitude,
                        longitude: origin?.longitude || MAP_SETTINGS.defaultLongitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                    followsUserLocation={isMonitoring}
                    onPress={handleMapPress}
                >
                    {/* Origin Marker */}
                    {origin && (
                        <Marker
                            coordinate={origin}
                            title="Start"
                            pinColor="green"
                        />
                    )}

                    {/* Destination Marker */}
                    {destination && (
                        <Marker
                            coordinate={destination}
                            title="Destination"
                            pinColor="red"
                        />
                    )}

                    {/* Route */}
                    {origin && destination && GOOGLE_MAPS_CONFIG.apiKey !== 'YOUR_GOOGLE_API_KEY' && (
                        <MapViewDirections
                            origin={origin}
                            destination={destination}
                            apikey={GOOGLE_MAPS_CONFIG.apiKey}
                            strokeWidth={4}
                            strokeColor={colors.primary}
                            onReady={handleRouteReady}
                            onError={(error) => {
                                console.error('Directions error:', error);
                                Alert.alert('Route Error', 'Failed to calculate route. Please check your API key.');
                            }}
                        />
                    )}

                    {/* Checkpoints */}
                    {checkpoints.map((checkpoint, index) => (
                        <React.Fragment key={checkpoint.id}>
                            <Marker
                                coordinate={{
                                    latitude: checkpoint.latitude,
                                    longitude: checkpoint.longitude
                                }}
                                title={checkpoint.name}
                                description={checkpoint.expectedTime ?
                                    `Expected: ${new Date(checkpoint.expectedTime).toLocaleTimeString()}` :
                                    'Checkpoint'}
                                pinColor={
                                    checkpoint.reached ? 'green' :
                                        checkpoint.missed ? 'red' :
                                            index === currentCheckpointIndex ? 'blue' : 'orange'
                                }
                            />
                            <Circle
                                center={{
                                    latitude: checkpoint.latitude,
                                    longitude: checkpoint.longitude
                                }}
                                radius={checkpoint.radius}
                                strokeColor="rgba(255, 72, 88, 0.5)"
                                fillColor="rgba(255, 72, 88, 0.2)"
                            />
                        </React.Fragment>
                    ))}
                </MapView>
            </View>

            {/* Route Setup Panel */}
            {showRouteSetup && (
                <View style={styles.setupPanel}>
                    <Text style={styles.setupTitle}>Setup Your Route</Text>

                    {/* Mode Toggle */}
                    <View style={styles.modeToggle}>
                        <Text style={styles.modeLabel}>Automatic Checkpoints</Text>
                        <Switch
                            value={autoMode}
                            onValueChange={setAutoMode}
                            trackColor={{ false: '#ccc', true: colors.primary }}
                            disabled={isMonitoring}
                        />
                    </View>

                    {!autoMode && (
                        <Text style={styles.manualHint}>
                            Tap on the map to add checkpoints along your route
                        </Text>
                    )}

                    {/* Destination Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Destination</Text>
                        <GooglePlacesAutocomplete
                            placeholder="Search destination..."
                            onPress={(data, details = null) => {
                                if (details) {
                                    setDestination({
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                    });
                                }
                            }}
                            query={{
                                key: GOOGLE_MAPS_CONFIG.apiKey,
                                language: 'en',
                                components: 'country:in'
                            }}
                            fetchDetails={true}
                            styles={{
                                textInput: styles.textInput,
                                container: { flex: 0 },
                            }}
                            enablePoweredByContainer={false}
                        />
                    </View>

                    {/* Checkpoint Count */}
                    {checkpoints.length > 0 && (
                        <Text style={styles.checkpointCount}>
                            {checkpoints.length} checkpoint{checkpoints.length > 1 ? 's' : ''} set
                        </Text>
                    )}

                    {/* Start Button */}
                    <TouchableOpacity
                        style={[styles.startButton, !destination && styles.disabledButton]}
                        onPress={startRouteMonitoring}
                        disabled={!destination || isMonitoring}
                    >
                        <Text style={styles.startButtonText}>
                            {isMonitoring ? 'Monitoring...' : 'Start Monitoring'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Monitoring Status */}
            {isMonitoring && (
                <View style={styles.statusPanel}>
                    <View style={styles.statusHeader}>
                        <Text style={styles.statusTitle}>🛡️ Route Monitoring Active</Text>
                        <Text style={styles.statusMode}>{autoMode ? 'Auto' : 'Manual'} Mode</Text>
                    </View>

                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>
                            Checkpoint {currentCheckpointIndex + 1} of {checkpoints.length}
                        </Text>
                        {checkpoints[currentCheckpointIndex] && (
                            <Text style={styles.nextCheckpoint}>
                                Next: {checkpoints[currentCheckpointIndex].name}
                            </Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={stopRouteMonitoring}
                    >
                        <Text style={styles.stopButtonText}>Stop Monitoring</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* SOS Modal */}
            <SosModule visible={showSosModal} onCancel={cancelSos} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.primary,
    },
    backButton: {
        fontSize: 28,
        color: colors.white,
    },
    headerTitle: {
        ...typography.h2,
        color: colors.white,
        fontWeight: 'bold',
    },
    resetButton: {
        ...typography.body,
        color: colors.white,
        fontWeight: '600',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    setupPanel: {
        backgroundColor: colors.white,
        padding: spacing.lg,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    setupTitle: {
        ...typography.h2,
        marginBottom: spacing.md,
    },
    modeToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
    },
    modeLabel: {
        ...typography.body,
        fontWeight: '600',
    },
    manualHint: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        fontStyle: 'italic',
    },
    inputContainer: {
        marginBottom: spacing.md,
    },
    inputLabel: {
        ...typography.body,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    textInput: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
    },
    checkpointCount: {
        ...typography.body,
        color: colors.primary,
        textAlign: 'center',
        marginBottom: spacing.md,
        fontWeight: '600',
    },
    startButton: {
        backgroundColor: colors.primary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: colors.textSecondary,
        opacity: 0.5,
    },
    startButtonText: {
        ...typography.button,
        color: colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    statusPanel: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    statusTitle: {
        ...typography.h3,
        color: colors.white,
        fontWeight: 'bold',
    },
    statusMode: {
        ...typography.body,
        color: colors.white,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    progressContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    progressText: {
        ...typography.body,
        color: colors.white,
        fontWeight: '600',
        marginBottom: spacing.xs,
    },
    nextCheckpoint: {
        ...typography.caption,
        color: colors.white,
    },
    stopButton: {
        backgroundColor: colors.white,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    stopButtonText: {
        ...typography.button,
        color: colors.primary,
        fontWeight: 'bold',
    },
});
