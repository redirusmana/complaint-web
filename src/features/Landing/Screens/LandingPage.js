import React from "react";
import { Link } from "react-router-dom";
import example from "../../../assets/images/example.jpg";
import logo from "../../../assets/images/bootstrap.png";
// import bgCard from "../../../assets/images/bg-card1.jpg";
import bgCards from "../../../assets/images/bg-card.jpg";
import "../Style/style.css";

class LandingPage extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        {/* Navbar */}
        <nav className="navbar  navbar-expand-lg navbar-light bg-primary">
          {/*bg-transparent fixed-top */}
          <Link to="/" className="navbar-brand">
            <img src={logo} width="40" height="40" alt="" />
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item ">
                <Link
                  to="/login"
                  className="btn btn-md font-weight-bold btn-link text-light"
                >
                  Log In
                </Link>
              </li>
              <li className="nav-item ">
                <Link
                  to="/register"
                  className="btn btn-md font-weight-bold btn-light btn-rounded-circle text-primary"
                >
                  Sign Up {/*  <i class="icofont-sign-in icofont-1x"></i> */}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {/* Navbar */}

        {/* Landing Page */}
        <div className="container-fluid bg-primary">
          <div className="row p-5">
            <div className="col-lg-15">
              <div className="row p-5">
                <div className="col-lg-1"></div>
                <div className="col-lg-22">
                  <div>
                    <img className="m-auto img-fluid" src={example} alt="" />
                  </div>
                </div>
                <div className="col-lg-1"></div>
              </div>
            </div>
            <div className="col-lg-9 m-auto">
              <div className="">
                <h1 className="font-weight-bold text-white">PAPANKU</h1>
                <br />
                <h2 className="text-white">
                  Buat Keputusan yang Lebih Cerdas untuk dalam menyelesaikan
                  perkerjaan anda
                </h2>
              </div>
            </div>
          </div>
        </div>
        {/* Landing Page */}

        {/* Page 2 */}
        <div
          className="container-fluid bg-primary"
          style={
            {
              // backgroundImage: `url(${bgCard})`,
              // backgroundPosition: "center",
              // backgroundSize: "cover",
              // backgroundRepeat: "no-repeat"
            }
          }
        >
          <div className="container">
            <div className="row pl-5 pr-5">
              <div className="col-lg-6">
                <div className="card text-center">
                  <img className="card-img-top" src={logo} alt="" />
                  <div className="card-body ">
                    <h5 className="text-center font-weight-bold">
                      AJAK TEMANMU
                    </h5>
                    <p className="text-center font-weight-normal text-secondary">
                      Invite Your Friends
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card text-center">
                  <img className="card-img-top" src={logo} alt="" />
                  <div className="card-body ">
                    <h5 className="text-center font-weight-bold">
                      DAFTAR TUGAS
                    </h5>
                    <p className="text-center font-weight-normal text-secondary">
                      List Task
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card text-center">
                  <img className="card-img-top" src={logo} alt="" />
                  <div className="card-body ">
                    <h5 className="text-center font-weight-bold">
                      BAGIKAN TUGAS
                    </h5>
                    <p className="text-center font-weight-normal text-secondary">
                      Distribution Task
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card text-center">
                  <img className="card-img-top" src={logo} alt="" />
                  <div className="card-body ">
                    <h5 className="text-center font-weight-bold">SELESAIKAN</h5>
                    <p className="text-center font-weight-normal text-secondary">
                      Finish Your Yask
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page 2 */}

        {/* Page 3 */}
        <div className="container-fluid">
          <div className="container p-5">
            <h5 className="text-center text-primary font-weight-bold">
              KEUNTUNGAN
            </h5>
            <h6 className="text-center">
              <b className="font-weight-bold">PAPANKU</b> dibuat untuk membantu
              dan mempermudah orang
              <br />
              yang kami layani dalam menyelesaikan tugas mereka
            </h6>
            <div className="row p-3">
              <div className="col-lg-8">
                <div className="text-center">
                  <img src={logo} alt="" />
                  <p className="mt-3 font-weight-bold">TERATUR</p>
                  <p className="text-secondary">
                    Manajemen tugas secara teratur adalah tindakan tracking
                    tugas-tugas tersebut dari penugasan hingga penyelesaian.
                    Jadi, manajemen tugas melibatkan , perencanaan, penentuan
                    prioritas, pengorganisasian dan pelaporan tugas.
                  </p>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="text-center">
                  <img src={logo} alt="" />
                  <p className="mt-3 font-weight-bold">EFEKTIF</p>
                  <p className="text-secondary">
                    Konfigurasikan tindakan otomatis dalam proyek Anda dan
                    biarkan sistem kami melakukan semua pekerjaan untuk Anda.
                    Dengan begitu Anda bekerja lebih pintar, bukan lebih keras.
                  </p>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="text-center">
                  <img src={logo} alt="" />
                  <p className="mt-3 font-weight-bold">TERHUBUNG</p>
                  <p className="text-secondary">
                    Kerja tim yang efisien untuk setiap pekerjaan apapun
                    menghemat waktu dan berkolaborasi dengan aman di seluruh tim
                    bersama semua temanmu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page 3 */}

        {/* Page 4 */}
        <div className="container-fluid">
          <div className="row p-5">
            <div className="col-lg-24">
              <h1 className="text-center">
                Gunakan PAPANKU dalam menyelesaikan
                <br /> semua pekerjaanmu
              </h1>
            </div>
          </div>
        </div>
        {/* Page 4 */}

        {/* Page 5 */}
        <div className="container-fluid">
          <div className="container">
            <div className="row p-5">
              <div className="col-lg-12 p-5">
                <div className="text-left">
                  <h6 className="font-weight-bold text-primary">
                    Ajak Temanmu!!
                  </h6>
                  <br />
                  <h3>
                    Posting ide atau pertanyaan untuk memulai diskusi dengan
                    tim. Tambahkan lampiran, sebutkan nama orang untuk
                    memperkaya percakapan
                  </h3>
                  <br />
                  <p className="text-secondary">
                    Berikan tim Anda sarana untuk bekerja bersama secara
                    efisien. Lihat apa yang semua orang kerjakan. Dapatkan
                    pemberitahuan tentang tugas baru
                  </p>
                </div>
              </div>
              <div
                className="col-lg-12 "
                style={{
                  backgroundImage: `url(${bgCards})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="row">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-18">
                    <div className="card text-center">
                      <img className="card-img-top " src={logo} alt="" />
                      <div className="card-body ">
                        <h5 className="text-center font-weight-bold">
                          AJAK TEMANMU
                        </h5>
                        <p className="text-center font-weight-normal text-secondary">
                          Invite Your Friends
                        </p>
                        <Link
                          to="/login"
                          className="btn btn-primary rounded-pill font-weight-bold"
                        >
                          JOIN
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page 5 */}

        {/* Page 6 */}
        <div className="container-fluid">
          <div className="container">
            <div className="row p-5">
              <div
                className="col-lg-12 "
                style={{
                  backgroundImage: `url(${bgCards})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="row">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-18">
                    <div className="card text-center">
                      <img className="card-img-top " src={logo} alt="" />
                      <div className="card-body ">
                        <h5 className="text-center font-weight-bold">
                          DAFTAR TUGAS
                        </h5>
                        <p className="text-center font-weight-normal text-secondary">
                          List Task
                        </p>
                        <Link
                          to="/login"
                          className="btn btn-primary rounded-pill font-weight-bold"
                        >
                          JOIN
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3"></div>
                </div>
              </div>
              <div className="col-lg-12 p-5">
                <div className="text-left">
                  <h6 className="font-weight-bold text-primary">
                    List Daftar Tugasmu!!
                  </h6>
                  <br />
                  <h3>
                    Buat rencana pekerjaan yang mencakup perincian hingga yang
                    terkecil. Pantau perkembangan begitu proyek mulai
                    dikerjakan. Bila ada masalah, identifikasi dan fokus pada
                    masalah itu.
                  </h3>
                  <br />
                  <p className="text-secondary">
                    Tetapkan tugas ke orang, dan lacak proses penyelesaiannya.
                    Atur tanggal jatuh tempo, prioritas, dan pengingat. Jika
                    tugas tersebut melibatkan beberapa tindakan, Anda bisa
                    membaginya secara lebih terperinci menjadi subtugas, Pemilik
                    tugas dapat mencatat waktu yang digunakan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page 6 */}

        {/* Page 7 */}
        <div className="container-fluid">
          <div className="container">
            <div className="row p-5">
              <div className="col-lg-12 p-5">
                <div className="text-left">
                  <h6 className="font-weight-bold text-primary">
                    Bagikan Tugas!!
                  </h6>
                  <br />
                  <h3>
                    Aktivitas rekan tim dalam proyek diperlihatkan di tampilan
                    linimasa sehingga Anda dapat dengan cepat mengetahui kabar
                    terbaru tentang apa yang terjadi dalam suatu rentang waktu.
                  </h3>
                  <br />
                  <p className="text-secondary">
                    Mengonsep ulang manajemen proyek dengan menambahkan fitur.
                    dan diskusikan berbagai elemen Projects. Setiap pengguna
                    mendapatkan halaman profil yang dilengkapi aliran aktivitas
                    mereka.Pembaruan proyek akan muncul di umpan yang
                    memungkinkan setiap orang mengetahui posisinya dan apa yang
                    telah dicapai. Posting status di Umpan untuk membuat
                    pengumuman kepada seluruh tim dan dukung penyampaian
                    pendapat atau ide di komentar.
                  </p>
                </div>
              </div>
              <div
                className="col-lg-12 "
                style={{
                  backgroundImage: `url(${bgCards})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="row">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-18">
                    <div className="card text-center">
                      <img className="card-img-top " src={logo} alt="" />
                      <div className="card-body ">
                        <h5 className="text-center font-weight-bold">
                          BAGIKAN TUGAS
                        </h5>
                        <p className="text-center font-weight-normal text-secondary">
                          Distribution Task
                        </p>
                        <Link
                          to="/login"
                          className="btn btn-primary rounded-pill font-weight-bold"
                        >
                          JOIN
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page 7 */}

        {/* Page 8 */}
        <div className="container-fluid">
          <div className="container">
            <div className="row p-5">
              <div
                className="col-lg-12 "
                style={{
                  backgroundImage: `url(${bgCards})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <div className="row">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-18">
                    <div className="card text-center">
                      <img className="card-img-top " src={logo} alt="" />
                      <div className="card-body ">
                        <h5 className="text-center font-weight-bold">
                          SELESAIKAN
                        </h5>
                        <p className="text-center font-weight-normal text-secondary">
                          Finish Your Yask
                        </p>
                        <Link
                          to="/login"
                          className="btn btn-primary rounded-pill font-weight-bold"
                        >
                          JOIN
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3"></div>
                </div>
              </div>
              <div className="col-lg-12 p-5">
                <div className="text-left">
                  <h6 className="font-weight-bold text-primary">
                    Selesaikan!!
                  </h6>
                  <br />
                  <h3>
                    hubungan di mana penyelesaian suatu tugas bergantung pada
                    dilakukannya lebih dulu satu tugas lain atau lebih.
                  </h3>
                  <br />
                  <p className="text-secondary">
                    Semua tugas yang mulai dan tanggal selesainya belum
                    ditentukan ditempatkan dalam kolom Tugas Tidak Terjadwal.
                    Anda bisa menentukan hubungan antartugas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Page 8 */}

        {/* Page 9 */}
        <div className="container-fluid bg-primary">
          <div className="row p-5">
            <div className="col-lg-24">
              <div className="text-center p-5">
                <h1 className="italic text-center text-white m-5">
                  Bergabunglah dengan orang orang yang menggunakan PAPANKU dalam
                  menyelesaikan semua pekerjaan - pekerjaanmu
                </h1>
                <Link
                  to="/register"
                  className="btn btn-outline-light btn-lg rounded-pill m-5"
                >
                  Let's Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Page 9 */}

        {/* Footer */}
        <div className="container-fluid bg-primary">
          <div className="row text-white">
            <div className="col-lg-24">
              {/* PAPANKU */}
              <p className="text-center m-2">
                Copyright &copy; 2019. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
      </React.Fragment>
    );
  }
}

export default LandingPage;
