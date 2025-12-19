// PathSimulator - Core logic for checkpoint-based route monitoring
// Monitors user progress and triggers SOS if checkpoints are missed

import { MAP_SETTINGS } from '../config/google.config';

class PathSimulator {
    constructor() {
        this.route = null;
        this.checkpoints = [];
        this.currentCheckpointIndex = 0;
        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.onCheckpointReached = null;
        this.onCheckpointMissed = null;
        this.userLocation = null;
    }

    // Initialize route and checkpoints
    initRoute(routeCoordinates, mode = 'automatic') {
        this.route = routeCoordinates;
        this.currentCheckpointIndex = 0;

        if (mode === 'automatic') {
            this.generateAutomaticCheckpoints();
        }
        // For manual mode, checkpoints are set via addCheckpoint()

        return this.checkpoints;
    }

    // Generate checkpoints automatically based on route geometry
    generateAutomaticCheckpoints() {
        if (!this.route || this.route.length < 2) {
            return [];
        }

        this.checkpoints = [];
        const totalDistance = this.calculateTotalDistance(this.route);
        const checkpointInterval = Math.max(1000, totalDistance / 5); // Checkpoint every ~1km or 5 total

        let accumulatedDistance = 0;
        let checkpointCount = 1;

        for (let i = 1; i < this.route.length; i++) {
            const segmentDistance = this.getDistanceBetween(
                this.route[i - 1],
                this.route[i]
            );
            accumulatedDistance += segmentDistance;

            if (accumulatedDistance >= checkpointInterval) {
                const checkpoint = {
                    id: `checkpoint_${checkpointCount}`,
                    name: `Checkpoint ${checkpointCount}`,
                    latitude: this.route[i].latitude,
                    longitude: this.route[i].longitude,
                    expectedTime: this.calculateExpectedTime(accumulatedDistance),
                    radius: MAP_SETTINGS.checkpointRadius,
                    reached: false,
                    missed: false
                };

                this.checkpoints.push(checkpoint);
                accumulatedDistance = 0;
                checkpointCount++;
            }
        }

        // Add final destination as last checkpoint
        const lastPoint = this.route[this.route.length - 1];
        this.checkpoints.push({
            id: `checkpoint_${checkpointCount}`,
            name: 'Destination',
            latitude: lastPoint.latitude,
            longitude: lastPoint.longitude,
            expectedTime: this.calculateExpectedTime(totalDistance),
            radius: MAP_SETTINGS.checkpointRadius,
            reached: false,
            missed: false
        });

        return this.checkpoints;
    }

    // Add manual checkpoint
    addCheckpoint(latitude, longitude, name) {
        const checkpointCount = this.checkpoints.length + 1;
        const checkpoint = {
            id: `checkpoint_${checkpointCount}`,
            name: name || `Checkpoint ${checkpointCount}`,
            latitude,
            longitude,
            expectedTime: null, // Will be calculated when monitoring starts
            radius: MAP_SETTINGS.checkpointRadius,
            reached: false,
            missed: false
        };

        this.checkpoints.push(checkpoint);
        return checkpoint;
    }

    // Start monitoring user's progress
    startMonitoring(userLocation, callbacks = {}) {
        this.isMonitoring = true;
        this.userLocation = userLocation;
        this.onCheckpointReached = callbacks.onCheckpointReached;
        this.onCheckpointMissed = callbacks.onCheckpointMissed;

        // Set expected times if not set (for manual mode)
        this.updateExpectedTimes();

        // Check progress every 5 seconds
        this.monitoringInterval = setInterval(() => {
            this.checkProgress();
        }, 5000);
    }

    // Stop monitoring
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
    }

    // Update user location
    updateLocation(location) {
        this.userLocation = location;
    }

    // Check if user has reached or missed checkpoints
    checkProgress() {
        if (!this.isMonitoring || !this.userLocation) {
            return;
        }

        const currentCheckpoint = this.checkpoints[this.currentCheckpointIndex];

        if (!currentCheckpoint || currentCheckpoint.reached || currentCheckpoint.missed) {
            return;
        }

        // Check if user is near checkpoint
        const distance = this.getDistanceBetween(
            this.userLocation,
            currentCheckpoint
        );

        if (distance <= currentCheckpoint.radius) {
            // Checkpoint reached!
            currentCheckpoint.reached = true;
            currentCheckpoint.reachedAt = Date.now();

            if (this.onCheckpointReached) {
                this.onCheckpointReached(currentCheckpoint, this.currentCheckpointIndex);
            }

            // Move to next checkpoint
            this.currentCheckpointIndex++;

            // Check if route completed
            if (this.currentCheckpointIndex >= this.checkpoints.length) {
                this.stopMonitoring();
            }
        } else {
            // Check if checkpoint is missed (timeout)
            const now = Date.now();
            if (now > currentCheckpoint.expectedTime) {
                currentCheckpoint.missed = true;
                currentCheckpoint.missedAt = now;

                if (this.onCheckpointMissed) {
                    this.onCheckpointMissed(currentCheckpoint, this.currentCheckpointIndex);
                }

                // Move to next checkpoint even if missed
                this.currentCheckpointIndex++;
            }
        }
    }

    // Calculate expected arrival times
    updateExpectedTimes() {
        const now = Date.now();
        let cumulativeDistance = 0;

        for (let i = 0; i < this.checkpoints.length; i++) {
            const checkpoint = this.checkpoints[i];

            if (i === 0 && this.userLocation) {
                cumulativeDistance = this.getDistanceBetween(this.userLocation, checkpoint);
            } else if (i > 0) {
                cumulativeDistance += this.getDistanceBetween(
                    this.checkpoints[i - 1],
                    checkpoint
                );
            }

            checkpoint.expectedTime = now + this.calculateExpectedTime(cumulativeDistance);
        }
    }

    // Calculate expected time based on distance and speed
    calculateExpectedTime(distanceMeters) {
        const speedMps = (MAP_SETTINGS.speedKmh * 1000) / 3600; // km/h to m/s
        const timeSeconds = distanceMeters / speedMps;
        return timeSeconds * 1000; // Convert to milliseconds
    }

    // Calculate total route distance
    calculateTotalDistance(coordinates) {
        let total = 0;
        for (let i = 1; i < coordinates.length; i++) {
            total += this.getDistanceBetween(coordinates[i - 1], coordinates[i]);
        }
        return total;
    }

    // Calculate distance between two coordinates (Haversine formula)
    getDistanceBetween(coord1, coord2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = (coord1.latitude * Math.PI) / 180;
        const φ2 = (coord2.latitude * Math.PI) / 180;
        const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
        const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    // Get current checkpoint
    getCurrentCheckpoint() {
        return this.checkpoints[this.currentCheckpointIndex];
    }

    // Get all checkpoints
    getAllCheckpoints() {
        return this.checkpoints;
    }

    // Reset simulator
    reset() {
        this.stopMonitoring();
        this.route = null;
        this.checkpoints = [];
        this.currentCheckpointIndex = 0;
        this.userLocation = null;
    }
}

export default PathSimulator;
