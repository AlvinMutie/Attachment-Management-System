import 'package:flutter/foundation.dart';
import '../core/errors/app_exceptions.dart';
import '../models/workspace_model.dart';
import '../services/workspace_service.dart';

enum WorkspaceStatus { initial, loading, loaded, error }

/// Provider for student dashboard workspace data.
/// Uses cached data and prevents duplicate concurrent fetches.
class WorkspaceProvider extends ChangeNotifier {
  final WorkspaceService _service;

  WorkspaceStatus _status = WorkspaceStatus.initial;
  WorkspaceModel? _workspace;
  String? _errorMessage;
  bool _isFetching = false;

  WorkspaceProvider({WorkspaceService? service})
      : _service = service ?? WorkspaceService();

  WorkspaceStatus get status => _status;
  WorkspaceModel? get workspace => _workspace;
  String? get errorMessage => _errorMessage;
  bool get isLoading => _status == WorkspaceStatus.loading;
  bool get hasData => _status == WorkspaceStatus.loaded && _workspace != null;
  bool get hasError => _status == WorkspaceStatus.error;

  /// Fetches the workspace. No-ops if a fetch is already in flight.
  Future<void> fetchWorkspace({bool forceRefresh = false}) async {
    if (_isFetching) return;
    if (!forceRefresh && _status == WorkspaceStatus.loaded) return;

    _isFetching = true;
    _status = WorkspaceStatus.loading;
    _errorMessage = null;
    notifyListeners();

    try {
      final workspace = await _service.getWorkspace();
      _workspace = workspace;
      _status = WorkspaceStatus.loaded;
      _errorMessage = null;
    } on UnauthorizedException {
      _status = WorkspaceStatus.error;
      _errorMessage = 'Your session has expired. Please sign in again.';
    } on AppException catch (e) {
      _status = WorkspaceStatus.error;
      _errorMessage = e.message;
    } catch (e) {
      _status = WorkspaceStatus.error;
      _errorMessage =
          'Failed to load your dashboard. Please check your connection and try again.';
    } finally {
      _isFetching = false;
      notifyListeners();
    }
  }

  /// Populates realistic demo workspace for offline exploration
  void loadDemoData() {
    _workspace = _getDemoWorkspace();
    _status = WorkspaceStatus.loaded;
    _errorMessage = null;
    notifyListeners();
  }

  static WorkspaceModel _getDemoWorkspace() {
    return const WorkspaceModel(
      student: StudentProfile(
        id: 'demo-student-id',
        admissionNumber: 'CT201/0042/22',
        course: 'BSc Software Engineering',
        department: 'Computing & Informatics',
        placementStatus: 'APPROVED',
        organizationName: 'Safaricom PLC HQ',
        organizationAddress: 'Waiyaki Way, Nairobi',
        contactPerson: 'Eng. Sarah Jenkins',
        user: UserRef(id: 'usr-1', name: 'Alvin Mutie', email: 'student_a@ams.com'),
        industrySupervisor: UserRef(id: 'usr-2', name: 'Eng. Sarah Jenkins', email: 'sarah.j@safaricom.co.ke'),
        universitySupervisor: UserRef(id: 'usr-3', name: 'Dr. James Okoth', email: 'unisup_a@ams.com'),
      ),
      dates: DateMetrics(
        startDate: '2026-05-04',
        endDate: '2026-07-24',
        daysCompleted: 33,
        totalDays: 60,
        percentElapsed: 55,
        daysRemaining: 27,
      ),
      attendance: AttendanceStats(
        totalRecords: 33,
        presentCount: 31,
        lateCount: 1,
        absentCount: 0,
        excusedCount: 1,
        rate: 96,
        status: 'COMPLIANT',
      ),
      logbooksSummary: LogbooksSummary(
        total: 7,
        approved: 5,
        pending: 1,
        rejected: 1,
      ),
      assessmentsSummary: AssessmentsSummary(
        total: 2,
        industrySubmitted: true,
        universitySubmitted: true,
      ),
      actionQueue: [
        ActionItem(
          id: 'act-1',
          priority: 'HIGH',
          title: 'Revise Week 6 Logbook',
          description: 'Supervisor requested additional technical details on API integration.',
          actionText: 'Revise Logbook',
        ),
        ActionItem(
          id: 'act-2',
          priority: 'MEDIUM',
          title: 'Today Check-In Available',
          description: 'Generate dynamic QR token for supervisor verification.',
          actionText: 'Check In',
        ),
      ],
      deadlines: [
        DeadlineItem(
          id: 'dl-1',
          title: 'Week 7 Logbook Submission',
          targetDate: '2026-10-06',
          daysRemaining: 3,
          status: 'UPCOMING',
          category: 'PLACEMENT',
        ),
        DeadlineItem(
          id: 'dl-2',
          title: 'Midterm Evaluation Rubric',
          targetDate: '2026-10-13',
          daysRemaining: 10,
          status: 'UPCOMING',
          category: 'ASSESSMENT',
        ),
      ],
      readiness: ReadinessResult(
        score: 88,
        ready: true,
        checklist: ReadinessChecklist(
          placementApproved: true,
          industrySupervisorAssigned: true,
          universitySupervisorAssigned: true,
          attendanceThresholdMet: true,
          logbooksSubmittedAndReviewed: true,
          supervisionCompleted: true,
          industryAssessmentCompleted: true,
          universityAssessmentCompleted: true,
        ),
        blockers: [],
      ),
    );
  }

  /// Retries fetching after an error
  Future<void> retry() => fetchWorkspace(forceRefresh: true);

  /// Clears cached data (e.g., on logout)
  void clear() {
    if (_status == WorkspaceStatus.initial && _workspace == null) return;
    _workspace = null;
    _status = WorkspaceStatus.initial;
    _errorMessage = null;
    _isFetching = false;
    notifyListeners();
  }
}
